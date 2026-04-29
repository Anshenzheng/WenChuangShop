package com.yuwen.wenchuang.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yuwen.wenchuang.common.PageResult;
import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.entity.Category;
import com.yuwen.wenchuang.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryMapper categoryMapper;
    
    public List<Category> getAllActiveCategories() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getStatus, 1)
                        .orderByAsc(Category::getSort)
        );
    }
    
    public PageResult<Category> getCategoryPage(Integer page, Integer size) {
        Page<Category> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSort);
        
        Page<Category> result = categoryMapper.selectPage(pageParam, wrapper);
        
        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }
    
    @Transactional
    public Result<Category> createCategory(Category category) {
        category.setStatus(1);
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());
        
        categoryMapper.insert(category);
        return Result.success("创建成功", category);
    }
    
    @Transactional
    public Result<Category> updateCategory(Category category) {
        Category existCategory = categoryMapper.selectById(category.getId());
        if (existCategory == null) {
            return Result.error("分类不存在");
        }
        
        category.setUpdateTime(LocalDateTime.now());
        categoryMapper.updateById(category);
        
        return Result.success("更新成功", category);
    }
    
    @Transactional
    public Result<Void> deleteCategory(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }
        
        categoryMapper.deleteById(id);
        return Result.success();
    }
}
