package com.yuwen.wenchuang.controller;

import com.yuwen.wenchuang.common.Result;
import com.yuwen.wenchuang.entity.Category;
import com.yuwen.wenchuang.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public Result<List<Category>> list() {
        List<Category> categories = categoryService.getAllActiveCategories();
        return Result.success(categories);
    }
}
