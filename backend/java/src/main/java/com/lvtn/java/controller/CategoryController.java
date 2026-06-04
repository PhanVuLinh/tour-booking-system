package com.lvtn.java.controller;

import com.lvtn.java.domain.entity.Category;
import com.lvtn.java.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/category")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryService getCategoryService() {
        return categoryService;
    }
    @GetMapping
    public ResponseEntity<List<Category>> findAll(){
        return ResponseEntity.ok(categoryService.findAll());
    }

    @PostMapping
    public ResponseEntity<Category> save(@RequestBody Category category){
        return ResponseEntity.ok(categoryService.save(category));
    }
}
