import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product, Category, PageResult } from '../../models/product.model';
import { Order, OrderStatus, OrderStatusText } from '../../models/order.model';
import { ApiResponse } from '../../models/common.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab = 'products';
  
  products: Product[] = [];
  productPage = 1;
  productSize = 10;
  productTotal = 0;
  productKeyword = '';
  loadingProducts = true;
  
  orders: Order[] = [];
  orderPage = 1;
  orderSize = 10;
  orderTotal = 0;
  orderStatus: number | null = null;
  orderNo = '';
  loadingOrders = true;
  
  categories: Category[] = [];
  
  showProductModal = false;
  editingProduct: Product | null = null;
  submitting = false;
  
  successMessage = '';
  errorMessage = '';

  navItems = [
    { id: 'products', label: '商品管理', icon: '📦' },
    { id: 'orders', label: '订单管理', icon: '📋' },
    { id: 'categories', label: '分类管理', icon: '🏷️' }
  ];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'products';
    });
    
    this.loadCategories();
    this.loadProducts();
    this.loadOrders();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate([], { queryParams: { tab }, queryParamsHandling: 'merge' });
    
    if (tab === 'products' && this.products.length === 0) {
      this.loadProducts();
    }
    if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.categories = response.data;
        }
      }
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getProducts(this.productPage, this.productSize, this.productKeyword).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.products = response.data.records;
          this.productTotal = response.data.total;
        }
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  searchProducts(): void {
    this.productPage = 1;
    this.loadProducts();
  }

  loadOrders(): void {
    this.loadingOrders = true;
    this.orderService.getOrders(this.orderPage, this.orderSize, this.orderStatus || undefined).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.orders = response.data.records;
          this.orderTotal = response.data.total;
        }
        this.loadingOrders = false;
      },
      error: () => {
        this.loadingOrders = false;
      }
    });
  }

  getStatusText(status: number): string {
    return OrderStatusText[status] || '未知';
  }

  getStatusClass(status: number): string {
    switch (status) {
      case OrderStatus.PENDING: return 'badge-warning';
      case OrderStatus.PAID: return 'badge-info';
      case OrderStatus.DELIVERED: return 'badge-warning';
      case OrderStatus.COMPLETED: return 'badge-success';
      case OrderStatus.CANCELLED: return 'badge-danger';
      default: return 'badge-warning';
    }
  }

  deliveryOrder(order: Order): void {
    if (!confirm('确定要发货吗？')) return;
    
    this.orderService.deliveryOrder(order.id).subscribe({
      next: (response: ApiResponse<void>) => {
        if (response.code === 200) {
          this.successMessage = '发货成功';
          this.loadOrders();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as ApiResponse<unknown>)?.message || '操作失败';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  goToShop(): void {
    this.router.navigate(['/']);
  }
}
