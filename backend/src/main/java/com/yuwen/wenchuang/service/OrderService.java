package com.yuwen.wenchuang.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.OrderCreateDTO;
import com.yuwen.wenchuang.entity.*;
import com.yuwen.wenchuang.mapper.OrderItemMapper;
import com.yuwen.wenchuang.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserService userService;
    private final CartService cartService;
    private final ProductService productService;
    
    public Order getById(Long id) {
        return orderMapper.selectById(id);
    }
    
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>()
                        .eq(OrderItem::getOrderId, orderId)
        );
    }
    
    public PageResult<Order> getOrderPage(Integer page, Integer size, String username, Integer status) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return new PageResult<>(List.of(), 0L, size.longValue(), page.longValue());
        }
        
        Page<Order> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(Order::getUserId, user.getId());
        
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        
        wrapper.orderByDesc(Order::getCreateTime);
        
        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    public PageResult<Order> getAllOrderPage(Integer page, Integer size, Integer status, String orderNo) {
        Page<Order> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        
        if (orderNo != null && !orderNo.isEmpty()) {
            wrapper.like(Order::getOrderNo, orderNo);
        }
        
        wrapper.orderByDesc(Order::getCreateTime);
        
        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    @Transactional
    public Result<Map<String, Object>> createOrder(String username, OrderCreateDTO dto) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        List<Cart> carts = cartService.getCartByIds(dto.getCartIds());
        if (carts.isEmpty()) {
            return Result.error("购物车为空");
        }
        
        for (Cart cart : carts) {
            Product product = productService.getById(cart.getProductId());
            if (product == null || product.getStatus() != 1) {
                return Result.error("商品【" + cart.getProductName() + "】已下架");
            }
            if (product.getStock() < cart.getQuantity()) {
                return Result.error("商品【" + cart.getProductName() + "】库存不足");
            }
        }
        
        String orderNo = generateOrderNo();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (Cart cart : carts) {
            totalAmount = totalAmount.add(cart.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
        }
        
        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(user.getId());
        order.setUsername(dto.getUsername());
        order.setPhone(dto.getPhone());
        order.setAddress(dto.getAddress());
        order.setTotalAmount(totalAmount);
        order.setStatus(0);
        order.setRemark(dto.getRemark());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        orderMapper.insert(order);
        
        for (Cart cart : carts) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setOrderNo(orderNo);
            orderItem.setProductId(cart.getProductId());
            orderItem.setProductName(cart.getProductName());
            orderItem.setProductImage(cart.getProductImage());
            orderItem.setPrice(cart.getPrice());
            orderItem.setQuantity(cart.getQuantity());
            orderItem.setTotalAmount(cart.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
            orderItem.setCreateTime(LocalDateTime.now());
            
            orderItemMapper.insert(orderItem);
            
            productService.decreaseStock(cart.getProductId(), cart.getQuantity());
        }
        
        cartService.deleteCarts(dto.getCartIds());
        
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", order.getId());
        result.put("orderNo", order.getOrderNo());
        result.put("totalAmount", order.getTotalAmount());
        
        return Result.success("下单成功", result);
    }
    
    @Transactional
    public Result<Void> confirmPayment(Long orderId, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (!order.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        if (order.getStatus() != 0) {
            return Result.error("订单状态不正确");
        }
        
        order.setStatus(1);
        order.setPaymentTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        
        return Result.success();
    }
    
    @Transactional
    public Result<Void> deliveryOrder(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (order.getStatus() != 1) {
            return Result.error("订单状态不正确");
        }
        
        order.setStatus(2);
        order.setDeliveryTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        
        return Result.success();
    }
    
    @Transactional
    public Result<Void> completeOrder(Long orderId, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (!order.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        if (order.getStatus() != 2) {
            return Result.error("订单状态不正确");
        }
        
        order.setStatus(3);
        order.setCompleteTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        
        return Result.success();
    }
    
    @Transactional
    public Result<Void> cancelOrder(Long orderId, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (!order.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        if (order.getStatus() != 0 && order.getStatus() != 1) {
            return Result.error("订单状态不正确，无法取消");
        }
        
        order.setStatus(4);
        order.setUpdateTime(LocalDateTime.now());
        
        orderMapper.updateById(order);
        
        return Result.success();
    }
    
    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%06d", new Random().nextInt(1000000));
        return "YW" + timestamp + random;
    }
}
