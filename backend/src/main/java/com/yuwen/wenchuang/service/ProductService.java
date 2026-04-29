package com.yuwen.wenchuang.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.entity.Product;
import com.yuwen.wenchuang.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductMapper productMapper;
    
    public Product getById(Long id) {
        return productMapper.selectById(id);
    }
    
    public PageResult<Product> getProductPage(Integer page, Integer size, String keyword, Long categoryId, Integer status) {
        Page<Product> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Product::getName, keyword)
                    .or().like(Product::getDescription, keyword);
        }
        
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        
        if (status != null) {
            wrapper.eq(Product::getStatus, status);
        }
        
        wrapper.orderByDesc(Product::getSort)
                .orderByDesc(Product::getCreateTime);
        
        Page<Product> result = productMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    public PageResult<Product> getHotProducts(Integer page, Integer size) {
        Page<Product> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        wrapper.eq(Product::getStatus, 1)
                .orderByDesc(Product::getSales)
                .orderByDesc(Product::getCreateTime);
        
        Page<Product> result = productMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    @Transactional
    public Result<Product> createProduct(Product product) {
        product.setStatus(1);
        product.setSales(0);
        product.setCreateTime(LocalDateTime.now());
        product.setUpdateTime(LocalDateTime.now());
        product.setDeleted(0);
        
        productMapper.insert(product);
        return Result.success("创建成功", product);
    }
    
    @Transactional
    public Result<Product> updateProduct(Product product) {
        Product existProduct = productMapper.selectById(product.getId());
        if (existProduct == null) {
            return Result.error("商品不存在");
        }
        
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
        
        return Result.success("更新成功", product);
    }
    
    @Transactional
    public Result<Void> updateStatus(Long id, Integer status) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error("商品不存在");
        }
        
        product.setStatus(status);
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
        
        return Result.success();
    }
    
    @Transactional
    public Result<Void> updateStock(Long id, Integer stock) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            return Result.error("商品不存在");
        }
        
        product.setStock(stock);
        product.setUpdateTime(LocalDateTime.now());
        productMapper.updateById(product);
        
        return Result.success();
    }
    
    @Transactional
    public void decreaseStock(Long id, Integer quantity) {
        Product product = productMapper.selectById(id);
        if (product != null) {
            product.setStock(product.getStock() - quantity);
            product.setSales(product.getSales() + quantity);
            product.setUpdateTime(LocalDateTime.now());
            productMapper.updateById(product);
        }
    }
}
