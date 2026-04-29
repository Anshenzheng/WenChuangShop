import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, OrderStatusText } from '../../models/order.model';
import { PageResult } from '../../models/product.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  currentStatus: number | null = null;
  
  page = 1;
  size = 10;
  total = 0;
  totalPages = 0;

  statusTabs = [
    { label: '全部', value: null },
    { label: '待确认', value: OrderStatus.PENDING },
    { label: '已确认', value: OrderStatus.PAID },
    { label: '已发货', value: OrderStatus.DELIVERED },
    { label: '已完成', value: OrderStatus.COMPLETED },
    { label: '已取消', value: OrderStatus.CANCELLED }
  ];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders(this.page, this.size, this.currentStatus || undefined).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.orders = response.data.records;
          this.total = response.data.total;
          this.totalPages = response.data.pages;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterByStatus(status: number | null): void {
    this.currentStatus = status;
    this.page = 1;
    this.loadOrders();
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

  goToOrder(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadOrders();
    }
  }
}
