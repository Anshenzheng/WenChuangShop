package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.ReviewDTO;
import com.yuwen.wenchuang.entity.Review;
import com.yuwen.wenchuang.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @GetMapping("/product/{productId}")
    public Result<PageResult<Review>> getByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        PageResult<Review> result = reviewService.getReviewsByProduct(productId, page, size);
        return Result.success(result);
    }
    
    @GetMapping("/my")
    public Result<PageResult<Review>> getMyReviews(
            @AuthenticationPrincipal String username,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        PageResult<Review> result = reviewService.getMyReviews(username, page, size);
        return Result.success(result);
    }
    
    @PostMapping
    public Result<Review> create(
            @AuthenticationPrincipal String username,
            @Valid @RequestBody ReviewDTO dto
    ) {
        return reviewService.createReview(username, dto);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal String username
    ) {
        return reviewService.deleteReview(id, username);
    }
}
