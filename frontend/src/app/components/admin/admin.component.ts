import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AdminService } from '../../services/admin.service';
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
  productStatus: number | null = null;
  loadingProducts = true;
  
  orders: Order[] = [];
  orderPage = 1;
  orderSize = 10;
  orderTotal = 0;
  orderStatus: number | null = null;
  orderNo = '';
  loadingOrders = true;
  
  categories: Category[] = [];
  loadingCategories = false;
  
  showProductModal = false;
  isEditingProduct = false;
  productForm: FormGroup;
  
  showCategoryModal = false;
  isEditingCategory = false;
  categoryForm: FormGroup;
  
  showStockModal = false;
  selectedProductForStock: Product | null = null;
  stockForm: FormGroup;
  
  submitting = false;
  
  successMessage = '';
  errorMessage = '';

  navItems = [
    { id: 'products', label: '商品管理', icon: '📦' },
    { id: 'orders', label: '订单管理', icon: '📋' },
    { id: 'categories', label: '分类管理', icon: '🏷️' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(2000)],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [null, Validators.min(0)],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.maxLength(500)],
      categoryId: [null],
      categoryName: ['', Validators.maxLength(50)],
      sort: [0],
      status: [1]
    });
    
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      sort: [0]
    });
    
    this.stockForm = this.formBuilder.group({
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

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
    if (tab === 'categories' && this.categories.length === 0) {
      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.categories = response.data;
        }
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.adminService.getProducts(
      this.productPage, 
      this.productSize, 
      this.productKeyword || undefined,
      undefined,
      this.productStatus === null ? undefined : this.productStatus
    ).subscribe({
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

  filterProductsByStatus(status: number | null): void {
    this.productStatus = status;
    this.productPage = 1;
    this.loadProducts();
  }

  openCreateProductModal(): void {
    this.isEditingProduct = false;
    this.productForm.reset({
      id: null,
      name: '',
      description: '',
      price: 0,
      originalPrice: null,
      stock: 0,
      image: '',
      categoryId: null,
      categoryName: '',
      sort: 0,
      status: 1
    });
    this.showProductModal = true;
  }

  openEditProductModal(product: Product): void {
    this.isEditingProduct = true;
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      image: product.image,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      sort: product.sort,
      status: product.status
    });
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.isEditingProduct = false;
  }

  submitProduct(): void {
    if (this.productForm.invalid) return;
    
    this.submitting = true;
    const product = this.productForm.value;
    
    const request: Product = {
      ...product,
      id: this.isEditingProduct ? product.id : undefined,
      sales: 0
    } as Product;
    
    const observable = this.isEditingProduct 
      ? this.adminService.updateProduct(product.id, request)
      : this.adminService.createProduct(request);
    
    observable.subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = this.isEditingProduct ? '商品更新成功' : '商品创建成功';
          this.loadProducts();
          this.closeProductModal();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.submitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as ApiResponse<unknown>)?.message || '操作失败';
        this.submitting = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  toggleProductStatus(product: Product): void {
    const newStatus = product.status === 1 ? 0 : 1;
    const action = newStatus === 1 ? '上架' : '下架';
    
    if (!confirm(`确定要${action}该商品吗？`)) return;
    
    this.adminService.updateProductStatus(product.id, newStatus).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = `商品${action}成功`;
          this.loadProducts();
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

  openStockModal(product: Product): void {
    this.selectedProductForStock = product;
    this.stockForm.patchValue({
      stock: product.stock
    });
    this.showStockModal = true;
  }

  closeStockModal(): void {
    this.showStockModal = false;
    this.selectedProductForStock = null;
  }

  updateStock(): void {
    if (this.stockForm.invalid || !this.selectedProductForStock) return;
    
    this.submitting = true;
    const newStock = this.stockForm.value.stock;
    
    this.adminService.updateProductStock(this.selectedProductForStock.id, newStock).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '库存更新成功';
          this.loadProducts();
          this.closeStockModal();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.submitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as ApiResponse<unknown>)?.message || '操作失败';
        this.submitting = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
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

  openCreateCategoryModal(): void {
    this.isEditingCategory = false;
    this.categoryForm.reset({
      id: null,
      name: '',
      sort: 0
    });
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.isEditingCategory = true;
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      sort: category.sort
    });
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.isEditingCategory = false;
  }

  submitCategory(): void {
    if (this.categoryForm.invalid) return;
    
    this.submitting = true;
    const category = this.categoryForm.value;
    
    const request: Category = {
      ...category,
      id: this.isEditingCategory ? category.id : undefined,
      status: 1
    } as Category;
    
    const observable = this.isEditingCategory 
      ? this.adminService.updateCategory(category.id, request)
      : this.adminService.createCategory(request);
    
    observable.subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = this.isEditingCategory ? '分类更新成功' : '分类创建成功';
          this.loadCategories();
          this.closeCategoryModal();
          setTimeout(() => this.successMessage = '', 3000);
        } else {
          this.errorMessage = response.message;
          setTimeout(() => this.errorMessage = '', 3000);
        }
        this.submitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = (err.error as ApiResponse<unknown>)?.message || '操作失败';
        this.submitting = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  deleteCategory(category: Category): void {
    if (!confirm('确定要删除该分类吗？')) return;
    
    this.adminService.deleteCategory(category.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.successMessage = '分类删除成功';
          this.loadCategories();
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
