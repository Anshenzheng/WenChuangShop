import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Order, OrderItem, CreateOrderRequest, CreateOrderResponse, PageResult } from '../models/order.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(private http: HttpClient) { }
  
  getOrders(page: number = 1, size: number = 10, status?: number): Observable<ApiResponse<PageResult<Order>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    
    return this.http.get<ApiResponse<PageResult<Order>>>(`${API_URL}/orders`, { params });
  }
  
  getOrder(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${API_URL}/orders/${id}`);
  }
  
  createOrder(request: CreateOrderRequest): Observable<ApiResponse<CreateOrderResponse>> {
    return this.http.post<ApiResponse<CreateOrderResponse>>(`${API_URL}/orders`, request);
  }
  
  payOrder(orderId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/orders/${orderId}/pay`, {});
  }
  
  completeOrder(orderId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/orders/${orderId}/complete`, {});
  }
  
  cancelOrder(orderId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/orders/${orderId}/cancel`, {});
  }
}
