package com.yuwen.wenchuang.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.ReviewDTO;
import com.yuwen.wenchuang.entity.*;
import com.yuwen.wenchuang.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewMapper reviewMapper;
    private final UserService userService;
    private final OrderService orderService;
    private final OrderItemMapper orderItemMapper;
    
    public PageResult<Review> getReviewsByProduct(Long productId, Integer page, Integer size) {
        Page<Review> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(Review::getProductId, productId)
                .eq(Review::getStatus, 1)
                .orderByDesc(Review::getCreateTime);
        
        Page<Review> result = reviewMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    public PageResult<Review> getMyReviews(String username, Integer page, Integer size) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return new PageResult<>(List.of(), 0L, size.longValue(), page.longValue());
        }
        
        Page<Review> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(Review::getUserId, user.getId())
                .orderByDesc(Review::getCreateTime);
        
        Page<Review> result = reviewMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    @Transactional
    public Result<Review> createReview(String username, ReviewDTO dto) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Order order = orderService.getById(dto.getOrderId());
        if (order == null) {
            return Result.error("订单不存在");
        }
        
        if (!order.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        if (order.getStatus() != 3) {
            return Result.error("订单尚未完成，无法评价");
        }
        
        OrderItem orderItem = orderItemMapper.selectById(dto.getOrderItemId());
        if (orderItem == null) {
            return Result.error("订单项不存在");
        }
        
        if (!orderItem.getOrderId().equals(order.getId())) {
            return Result.error("订单项不属于该订单");
        }
        
        Review existReview = reviewMapper.selectOne(
                new LambdaQueryWrapper<Review>()
                        .eq(Review::getUserId, user.getId())
                        .eq(Review::getOrderItemId, dto.getOrderItemId())
        );
        
        if (existReview != null) {
            return Result.error("该商品已评价");
        }
        
        Review review = new Review();
        review.setUserId(user.getId());
        review.setUsername(user.getNickname() != null ? user.getNickname() : user.getUsername());
        review.setAvatar(user.getAvatar());
        review.setProductId(dto.getProductId());
        review.setOrderId(dto.getOrderId());
        review.setOrderItemId(dto.getOrderItemId());
        review.setRating(dto.getRating());
        review.setContent(dto.getContent());
        review.setImages(dto.getImages());
        review.setStatus(1);
        review.setCreateTime(LocalDateTime.now());
        review.setUpdateTime(LocalDateTime.now());
        
        reviewMapper.insert(review);
        return Result.success("评价成功", review);
    }
    
    @Transactional
    public Result<Void> deleteReview(Long reviewId, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Review review = reviewMapper.selectById(reviewId);
        if (review == null) {
            return Result.error("评价不存在");
        }
        
        if (!review.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        reviewMapper.deleteById(reviewId);
        return Result.success();
    }
    
    public Double getAverageRating(Long productId) {
        List<Review> reviews = reviewMapper.selectList(
                new LambdaQueryWrapper<Review>()
                        .eq(Review::getProductId, productId)
                        .eq(Review::getStatus, 1)
        );
        
        if (reviews.isEmpty()) {
            return 0.0;
        }
        
        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        return sum / reviews.size();
    }
    
    public Integer getReviewCount(Long productId) {
        return Math.toIntExact(reviewMapper.selectCount(
                new LambdaQueryWrapper<Review>()
                        .eq(Review::getProductId, productId)
                        .eq(Review::getStatus, 1)
        ));
    }
}
