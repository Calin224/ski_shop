import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, of } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);

  /**
   * Initializes the service by retrieving the cart from local storage.
   * If a cart ID is found, it retrieves the cart from the server.
   * Otherwise, it returns an observable of null.
   *
   * @returns An observable of the cart or null.
   */
  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo()
    });
  }
}
