import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);

  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0);
  });

  totals = computed(() => {
    const cart = this.cart();
    if(!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 0;
    const discount = 0;
    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    }
  });

  /**
   * Retrieves the cart by its ID.
   * 
   * @param id - The ID of the cart to retrieve.
   * @returns A subscription to the HTTP GET request.
   */
  getCart(id: string){
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  /**
   * Sends a POST request to the server to set the cart.
   * 
   * @param cart - The cart object to be set.
   * @returns A subscription to the HTTP POST request.
   */
  setCart(cart: Cart){
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart)
    });
  }

  /**
   * Adds an item to the cart. If the item already exists, its quantity is updated.
   * 
   * @param item - The item to add to the cart.
   * @param quantity - The quantity of the item to add. Defaults to 1.
   */
  addItemToCart(item: CartItem | Product, quantity = 1){
    const cart = this.cart() ?? this.createCart();
    if(this.isProduct(item)){
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1){
    const cart = this.cart();
    if(!cart) return; 
    const index = cart.items.findIndex(x => x.productId === productId);

    if(index !== -1){
      if(cart.items[index].quantity > quantity){
        cart.items[index].quantity -= quantity; // if the quantity of the item from the cart is greater than the quantity deleted just decrease the quantity from the cart
      } else {
        cart.items.splice(index, 1); // remove the item
      }

      if(cart.items.length === 0){
        this.deleteCart();
      }else{
        this.setCart(cart);
      }
    }
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }

  /**
   * Adds or updates an item in the cart.
   * 
   * @param items - The current list of items in the cart.
   * @param item - The item to add or update.
   * @param quantity - The quantity of the item to add.
   * @returns The updated list of items in the cart.
   */
  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if(index === -1){
      item.quantity = quantity;
      items.push(item);
    }else{
      items[index].quantity += quantity;
    }

    return items;
  }

  /**
   * Maps a product to a cart item.
   * 
   * @param item - The product to map.
   * @returns The mapped cart item.
   */
  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    };
  }

  /**
   * Checks if the given item is a product.
   * 
   * @param item - The item to check.
   * @returns True if the item is a product, false otherwise.
   */
  private isProduct(item: CartItem | Product): item is Product{
    return (item as Product).id !== undefined;
  }

  /**
   * Creates a new cart and stores its ID in local storage.
   * 
   * @returns The newly created cart.
   */
  createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}
