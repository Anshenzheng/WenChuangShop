import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Review, CreateReviewRequest, PageResult } from '../models/review.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  constructor(private http: HttpClient) { }
  
  getReviewsByProduct(productId: number, page: number = 1, size: number = 10): Observable<ApiResponse<PageResult<Review>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResult<Review>>>(`${API_URL}/reviews/product/${productId}`, { params });
  }
  
  getMyReviews(page: number = 1, size: number = 10): Observable<ApiResponse<PageResult<Review>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<PageResult<Review>>>(`${API_URL}/reviews/my`, { params });
  }
  
  createReview(request: CreateReviewRequest): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${API_URL}/reviews`, request);
  }
  
  deleteReview(reviewId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${API_URL}/reviews/${reviewId}`);
  }
}
