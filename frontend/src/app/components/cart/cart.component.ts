import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Cart[] = [];
  loading = true;
  selectedItems: number[] = [];
  totalPrice = 0;
  successMessage = '';
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.cartItems = response.data;
          this.selectedItems = this.cartItems.map(item => item.id);
          this.calculateTotal();
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleSelection(cartId: number): void {
    const index = this.selectedItems.indexOf(cartId);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(cartId);
    }
    this.calculateTotal();
  }

  selectAll(): void {
    if (this.selectedAll) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.cartItems.map(item => item.id);
    }
    this.calculateTotal();
  }

  get selectedAll(): boolean {
    return this.cartItems.length > 0 && this.selectedItems.length === this.cartItems.length;
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems
      .filter(item => this.selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  updateQuantity(item: Cart, delta: number): void {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: (response) => {
        if (response.code === 200) {
          item.quantity = newQuantity;
          this.calculateTotal();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '更新失败';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  removeItem(item: Cart): void {
    this.cartService.removeFromCart(item.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.cartItems = this.cartItems.filter(i => i.id !== item.id);
          this.selectedItems = this.selectedItems.filter(id => id !== item.id);
          this.calculateTotal();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || '删除失败';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  goToCheckout(): void {
    if (this.selectedItems.length === 0) {
      this.errorMessage = '请选择要购买的商品';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    
    this.router.navigate(['/checkout'], { 
      queryParams: { cartIds: this.selectedItems.join(',') } 
    });
  }
}
