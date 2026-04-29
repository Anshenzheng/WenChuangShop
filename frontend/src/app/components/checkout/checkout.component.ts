import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: Cart[] = [];
  cartIds: number[] = [];
  totalPrice = 0;
  loading = true;
  submitting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.checkoutForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      remark: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const cartIdsParam = this.route.snapshot.queryParams['cartIds'];
    if (cartIdsParam) {
      this.cartIds = cartIdsParam.split(',').map((id: string) => parseInt(id, 10));
    }
    
    if (this.cartIds.length === 0) {
      this.router.navigate(['/carts']);
      return;
    }
    
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.cartItems = response.data.filter(item => this.cartIds.includes(item.id));
          this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = '加载购物车失败';
      }
    });
  }

  get f() { return this.checkoutForm.controls; }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';
    
    const request: CreateOrderRequest = {
      username: this.f['username'].value,
      phone: this.f['phone'].value,
      address: this.f['address'].value,
      cartIds: this.cartIds,
      remark: this.f['remark'].value
    };
    
    this.orderService.createOrder(request).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.router.navigate(['/orders', response.data.orderId]);
        } else {
          this.errorMessage = response.message;
        }
        this.submitting = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '下单失败';
        this.submitting = false;
      }
    });
  }
}
