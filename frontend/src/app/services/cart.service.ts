import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Cart, AddCartRequest } from '../models/cart.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  constructor(private http: HttpClient) { }
  
  getCart(): Observable<ApiResponse<Cart[]>> {
    return this.http.get<ApiResponse<Cart[]>>(`${API_URL}/carts`);
  }
  
  addToCart(request: AddCartRequest): Observable<ApiResponse<Cart>> {
    return this.http.post<ApiResponse<Cart>>(`${API_URL}/carts`, request);
  }
  
  updateQuantity(cartId: number, quantity: number): Observable<ApiResponse<Cart>> {
    return this.http.put<ApiResponse<Cart>>(`${API_URL}/carts/${cartId}?quantity=${quantity}`, {});
  }
  
  removeFromCart(cartId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/carts/${cartId}`);
  }
  
  clearCart(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/carts`);
  }
}
