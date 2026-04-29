import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ReviewService } from '../../services/review.service';
import { Order, OrderItem, OrderStatus, OrderStatusText, CreateOrderRequest } from '../../models/order.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderItems: OrderItem[] = [];
  loading = true;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  
  showReviewModal = false;
  selectedItem: OrderItem | null = null;
  reviewRating = 5;
  reviewContent = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.loadOrder(+orderId);
      }
    });
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrder(id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.order = response.data.order;
          this.orderItems = response.data.items;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = '加载订单详情失败';
      }
    });
  }

  getStatusText(status: number): string {
    return OrderStatusText[status] || '未知';
  }

  getStatusClass(status: number): string {
    switch (status) {
      case OrderStatus.PENDING: return 'status-pending';
      case OrderStatus.PAID: return 'status-paid';
      case OrderStatus.DELIVERED: return 'status-delivered';
      case OrderStatus.COMPLETED: return 'status-completed';
      case OrderStatus.CANCELLED: return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  canPay(): boolean {
    return this.order?.status === OrderStatus.PENDING;
  }

  canCancel(): boolean {
    return this.order?.status === OrderStatus.PENDING || this.order?.status === OrderStatus.PAID;
  }

  canComplete(): boolean {
    return this.order?.status === OrderStatus.DELIVERED;
  }

  canReview(): boolean {
    return this.order?.status === OrderStatus.COMPLETED;
  }

  payOrder(): void {
    if (!this.order) return;
    
    this.submitting = true;
    this.orderService.payOrder(this.order.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '确认成功';
          this.loadOrder(this.order!.id);
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '操作失败';
        this.submitting = false;
      }
    });
  }

  cancelOrder(): void {
    if (!this.order) return;
    
    if (!confirm('确定要取消这个订单吗？')) return;
    
    this.submitting = true;
    this.orderService.cancelOrder(this.order.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '订单已取消';
          this.loadOrder(this.order!.id);
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '操作失败';
        this.submitting = false;
      }
    });
  }

  completeOrder(): void {
    if (!this.order) return;
    
    if (!confirm('确定要确认收货吗？')) return;
    
    this.submitting = true;
    this.orderService.completeOrder(this.order.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '确认收货成功';
          this.loadOrder(this.order!.id);
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '操作失败';
        this.submitting = false;
      }
    });
  }

  openReviewModal(item: OrderItem): void {
    this.selectedItem = item;
    this.reviewRating = 5;
    this.reviewContent = '';
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.selectedItem = null;
  }

  submitReview(): void {
    if (!this.selectedItem || !this.order || !this.reviewContent.trim()) {
      this.errorMessage = '请填写评价内容';
      return;
    }
    
    this.submitting = true;
    this.reviewService.createReview({
      orderItemId: this.selectedItem.id,
      orderId: this.order.id,
      productId: this.selectedItem.productId,
      rating: this.reviewRating,
      content: this.reviewContent
    }).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '评价成功';
          this.closeReviewModal();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '评价失败';
        this.submitting = false;
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
