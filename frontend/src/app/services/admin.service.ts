import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Product, Category, PageResult } from '../models/product.model';

const API_URL = 'http://localhost:8080/api/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  constructor(private http: HttpClient) { }

  getProducts(
    page: number = 1, 
    size: number = 10, 
    keyword?: string, 
    categoryId?: number,
    status?: number
  ): Observable<ApiResponse<PageResult<Product>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    
    return this.http.get<ApiResponse<PageResult<Product>>>(`${API_URL}/products`, { params });
  }

  createProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${API_URL}/products`, product);
  }

  updateProduct(productId: number, product: Product): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${API_URL}/products/${productId}`, product);
  }

  updateProductStatus(productId: number, status: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/products/${productId}/status?status=${status}`, {});
  }

  updateProductStock(productId: number, stock: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${API_URL}/products/${productId}/stock?stock=${stock}`, {});
  }

  getCategories(
    page: number = 1, 
    size: number = 10
  ): Observable<ApiResponse<PageResult<Category>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResult<Category>>>(`${API_URL}/categories`, { params });
  }

  createCategory(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${API_URL}/categories`, category);
  }

  updateCategory(categoryId: number, category: Category): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${API_URL}/categories/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/categories/${categoryId}`);
  }
}
