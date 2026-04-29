import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Product, Category, PageResult } from '../models/product.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) { }
  
  getProducts(page: number = 1, size: number = 10, keyword?: string, categoryId?: number): Observable<ApiResponse<PageResult<Product>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    
    return this.http.get<ApiResponse<PageResult<Product>>>(`${API_URL}/products`, { params });
  }
  
  getHotProducts(page: number = 1, size: number = 10): Observable<ApiResponse<PageResult<Product>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResult<Product>>>(`${API_URL}/products/hot`, { params });
  }
  
  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${API_URL}/products/${id}`);
  }
  
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${API_URL}/categories`);
  }
}
