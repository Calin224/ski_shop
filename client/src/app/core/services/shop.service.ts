import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Pagination} from '../../shared/models/pagination';
import {Product} from '../../shared/models/product';
import {ShopParams} from '../../shared/models/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  types: string[] = [];
  brands: string[] = [];

  /**
   * Retrieves a list of products based on the provided shop parameters.
   * 
   * @param shopParams - The parameters to filter and sort the products.
   * @returns An observable of the paginated list of products.
   */
  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if(shopParams.brands && shopParams.brands.length > 0){
      params = params.append('brands', shopParams.brands.join(','));
    }

    if(shopParams.types && shopParams.types.length > 0){
      params = params.append('types', shopParams.types.join(','));
    }

    if(shopParams.sort){
      params = params.append('sort', shopParams.sort);
    }

    if(shopParams.search){
      params = params.append('search', shopParams.search);
    }

    params = params.append('pageSize', shopParams.pageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<Pagination<Product>>(this.baseUrl + "products", {params});
  }

  /**
   * Retrieves a single product by its ID.
   * 
   * @param id - The ID of the product to retrieve.
   * @returns An observable of the product.
   */
  getProduct(id: number){
    return this.http.get<Product>(this.baseUrl + "products/" + id);
  }

  /**
   * Retrieves the list of product brands from the server.
   * If the brands are already loaded, it returns immediately.
   * 
   * @returns A subscription to the HTTP GET request.
   */
  getBrands() {
    if(this.brands.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + "products/brands").subscribe({
      next: res => this.brands = res
    });
  }

  /**
   * Retrieves the list of product types from the server.
   * If the types are already loaded, it returns immediately.
   * 
   * @returns A subscription to the HTTP GET request.
   */
  getTypes() {
    if(this.types.length > 0) return;
    return this.http.get<string[]>(this.baseUrl + "products/types").subscribe({
      next: res => this.types = res
    });
  }
}