package com.lvtn.java.service;

import com.lvtn.java.domain.entity.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> findAll();
    Optional<Category> findById(Integer id);
    Category save(Category category);
}
