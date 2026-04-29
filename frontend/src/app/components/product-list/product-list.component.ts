import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: number | null = null;
  keyword = '';
  loading = true;
  
  page = 1;
  size = 12;
  total = 0;
  totalPages = 0;
  
  isHot = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.url.subscribe(url => {
      this.isHot = this.route.snapshot.routeConfig?.path === 'products/hot';
      this.loadProducts();
    });
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
    this.loading = true;
    
    if (this.isHot) {
      this.productService.getHotProducts(this.page, this.size).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.products = response.data.records;
            this.total = response.data.total;
            this.totalPages = response.data.pages;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.productService.getProducts(this.page, this.size, this.keyword, this.selectedCategory || undefined).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.products = response.data.records;
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
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.page = 1;
    this.loadProducts();
  }

  search(): void {
    this.page = 1;
    this.loadProducts();
  }

  goToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get pages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.page - 2);
    const end = Math.min(this.totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
