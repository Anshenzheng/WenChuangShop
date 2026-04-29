package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.OrderCreateDTO;
import com.yuwen.wenchuang.entity.Order;
import com.yuwen.wenchuang.entity.OrderItem;
import com.yuwen.wenchuang.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    public Result<PageResult<Order>> list(
            @AuthenticationPrincipal String username,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status
    ) {
        PageResult<Order> result = orderService.getOrderPage(page, size, username, status);
        return Result.success(result);
    }
    
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        Order order = orderService.getById(id);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        List<OrderItem> items = orderService.getOrderItems(id);
        
        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("items", items);
        
        return Result.success(result);
    }
    
    @PostMapping
    public Result<Map<String, Object>> create(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody OrderCreateDTO dto
    ) {
        return orderService.createOrder(username, dto);
    }
    
    @PutMapping("/{id}/pay")
    public Result<Void> pay(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        return orderService.confirmPayment(id, username);
    }
    
    @PutMapping("/{id}/complete")
    public Result<Void> complete(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        return orderService.completeOrder(id, username);
    }
    
    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        return orderService.cancelOrder(id, username);
    }
}
