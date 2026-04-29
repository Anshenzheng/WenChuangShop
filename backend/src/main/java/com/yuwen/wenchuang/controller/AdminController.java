package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.entity.Category;
import com.yuwen.wenchuang.entity.Order;
import com.yuwen.wenchuang.entity.Product;
import com.yuwen.wenchuang.entity.User;
import com.yuwen.wenchuang.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final UserService userService;
    
    @GetMapping("/products")
    public Result<PageResult<Product>> getProducts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer status
    ) {
        PageResult<Product> result = productService.getProductPage(page, size, keyword, categoryId, status);
        return Result.success(result);
    }
    
    @PostMapping("/products")
    public Result<Product> createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }
    
    @PutMapping("/products/{id}")
    public Result<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return productService.updateProduct(product);
    }
    
    @PutMapping("/products/{id}/status")
    public Result<Void> updateProductStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        return productService.updateStatus(id, status);
    }
    
    @PutMapping("/products/{id}/stock")
    public Result<Void> updateProductStock(
            @PathVariable Long id,
            @RequestParam Integer stock
    ) {
        return productService.updateStock(id, stock);
    }
    
    @GetMapping("/categories")
    public Result<PageResult<Category>> getCategories(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        PageResult<Category> result = categoryService.getCategoryPage(page, size);
        return Result.success(result);
    }
    
    @PostMapping("/categories")
    public Result<Category> createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
    
    @PutMapping("/categories/{id}")
    public Result<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return categoryService.updateCategory(category);
    }
    
    @DeleteMapping("/categories/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
    
    @GetMapping("/orders")
    public Result<PageResult<Order>> getOrders(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String orderNo
    ) {
        PageResult<Order> result = orderService.getAllOrderPage(page, size, status, orderNo);
        return Result.success(result);
    }
    
    @PutMapping("/orders/{id}/delivery")
    public Result<Void> deliveryOrder(@PathVariable Long id) {
        return orderService.deliveryOrder(id);
    }
    
    @GetMapping("/users")
    public Result<PageResult<User>> getUsers(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String username
    ) {
        PageResult<User> result = userService.getUserPage(page, size, username);
        return Result.success(result);
    }
    
    @PutMapping("/users/{id}/status")
    public Result<User> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Integer status
    ) {
        return userService.updateUserStatus(id, status);
    }
}
