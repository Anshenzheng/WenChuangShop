package com.yuwen.wenchuang.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.dto.CartDTO;
import com.yuwen.wenchuang.entity.Cart;
import com.yuwen.wenchuang.entity.Product;
import com.yuwen.wenchuang.entity.User;
import com.yuwen.wenchuang.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartMapper cartMapper;
    private final ProductService productService;
    private final UserService userService;
    
    public List<Cart> getCartList(String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return List.of();
        }
        
        return cartMapper.selectList(
                new LambdaQueryWrapper<Cart>()
                        .eq(Cart::getUserId, user.getId())
                        .orderByDesc(Cart::getCreateTime)
        );
    }
    
    @Transactional
    public Result<Cart> addToCart(String username, CartDTO dto) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Product product = productService.getById(dto.getProductId());
        if (product == null) {
            return Result.error("商品不存在");
        }
        
        if (product.getStatus() != 1) {
            return Result.error("商品已下架");
        }
        
        if (product.getStock() < dto.getQuantity()) {
            return Result.error("库存不足");
        }
        
        Cart existCart = cartMapper.selectOne(
                new LambdaQueryWrapper<Cart>()
                        .eq(Cart::getUserId, user.getId())
                        .eq(Cart::getProductId, dto.getProductId())
        );
        
        if (existCart != null) {
            existCart.setQuantity(existCart.getQuantity() + dto.getQuantity());
            existCart.setUpdateTime(LocalDateTime.now());
            cartMapper.updateById(existCart);
            return Result.success("添加成功", existCart);
        }
        
        Cart cart = new Cart();
        cart.setUserId(user.getId());
        cart.setProductId(product.getId());
        cart.setProductName(product.getName());
        cart.setProductImage(product.getImage());
        cart.setPrice(product.getPrice());
        cart.setQuantity(dto.getQuantity());
        cart.setCreateTime(LocalDateTime.now());
        cart.setUpdateTime(LocalDateTime.now());
        
        cartMapper.insert(cart);
        return Result.success("添加成功", cart);
    }
    
    @Transactional
    public Result<Cart> updateQuantity(Long cartId, Integer quantity, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Cart cart = cartMapper.selectById(cartId);
        if (cart == null) {
            return Result.error("购物车项不存在");
        }
        
        if (!cart.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        Product product = productService.getById(cart.getProductId());
        if (product != null && product.getStock() < quantity) {
            return Result.error("库存不足");
        }
        
        cart.setQuantity(quantity);
        cart.setUpdateTime(LocalDateTime.now());
        cartMapper.updateById(cart);
        
        return Result.success("更新成功", cart);
    }
    
    @Transactional
    public Result<Void> removeFromCart(Long cartId, String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        Cart cart = cartMapper.selectById(cartId);
        if (cart == null) {
            return Result.error("购物车项不存在");
        }
        
        if (!cart.getUserId().equals(user.getId())) {
            return Result.error("无权操作");
        }
        
        cartMapper.deleteById(cartId);
        return Result.success();
    }
    
    @Transactional
    public Result<Void> clearCart(String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }
        
        cartMapper.delete(
                new LambdaQueryWrapper<Cart>()
                        .eq(Cart::getUserId, user.getId())
        );
        
        return Result.success();
    }
    
    public List<Cart> getCartByIds(List<Long> cartIds) {
        return cartMapper.selectBatchIds(cartIds);
    }
    
    @Transactional
    public void deleteCarts(List<Long> cartIds) {
        cartMapper.deleteBatchIds(cartIds);
    }
}
