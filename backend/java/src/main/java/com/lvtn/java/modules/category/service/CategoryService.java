package com.lvtn.java.service;

import com.lvtn.java.domain.entity.Category;
import com.lvtn.java.dto.category.CategoryResponse;
import com.lvtn.java.dto.category.CategoryUpsertRequest;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<CategoryResponse> findAll();
    CategoryResponse findById(Integer id);
    CategoryResponse create(CategoryUpsertRequest request, Integer creatorId);
    CategoryResponse update(Integer id, CategoryUpsertRequest request, Integer updaterId);
    void delete(Integer id, Integer deleterId);
    List<CategoryResponse> findAllActive();
    List<CategoryResponse> findAllTrash();
    void restore(Integer id, Integer restorerId);
    void hardDelete(Integer id);
}
