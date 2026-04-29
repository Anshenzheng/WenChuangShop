import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  loading = true;
  addingToCart = false;
  quantity = 1;
  
  reviewPage = 1;
  reviewSize = 5;
  reviewTotal = 0;
  reviewTotalPages = 0;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(+productId);
        this.loadReviews(+productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.product = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = '加载商品信息失败';
      }
    });
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviewsByProduct(productId, this.reviewPage, this.reviewSize).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.reviews = response.data.records;
          this.reviewTotal = response.data.total;
          this.reviewTotalPages = response.data.pages;
        }
      }
    });
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    if (!this.product) return;
    
    if (this.quantity > this.product.stock) {
      this.errorMessage = '库存不足';
      return;
    }
    
    this.addingToCart = true;
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '已加入购物车';
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.addingToCart = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '添加失败';
        this.addingToCart = false;
      }
    });
  }

  changeQuantity(delta: number): void {
    if (!this.product) return;
    
    const newQuantity = this.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}
