package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.CartDTO;
import com.yuwen.wenchuang.entity.Cart;
import com.yuwen.wenchuang.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public Result<List<Cart>> list(@AuthenticationPrincipal String username) {
        List<Cart> carts = cartService.getCartList(username);
        return Result.success(carts);
    }
    
    @PostMapping
    public Result<Cart> add(@AuthenticationPrincipal String username, @Valid @RequestBody CartDTO dto) {
        return cartService.addToCart(username, dto);
    }
    
    @PutMapping("/{id}")
    public Result<Cart> update(
            @PathVariable Long id,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal String username
    ) {
        return cartService.updateQuantity(id, quantity, username);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id, @AuthenticationPrincipal String username) {
        return cartService.removeFromCart(id, username);
    }
    
    @DeleteMapping
    public Result<Void> clear(@AuthenticationPrincipal String username) {
        return cartService.clearCart(username);
    }
}
