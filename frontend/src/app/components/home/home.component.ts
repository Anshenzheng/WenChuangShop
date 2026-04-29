import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hotProducts: Product[] = [];
  newProducts: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHotProducts();
    this.loadNewProducts();
  }

  loadHotProducts(): void {
    this.productService.getHotProducts(1, 8).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.hotProducts = response.data.records;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadNewProducts(): void {
    this.productService.getProducts(1, 8).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.newProducts = response.data.records;
        }
      }
    });
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  viewAllHot(): void {
    this.router.navigate(['/products/hot']);
  }

  viewAllNew(): void {
    this.router.navigate(['/products']);
  }
}
