package com.lvtn.java.service.impl;

import com.lvtn.java.domain.entity.Category;
import com.lvtn.java.repository.CategoryRepository;
import com.lvtn.java.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryRepository getCategoryRepository() {
        return categoryRepository;
    }
    public List<Category> findAll(){
        return categoryRepository.findAll();
    }
    public Optional<Category> findById(Integer id){
        return categoryRepository.findById(id);
    }
    public Category save(Category category){
        return categoryRepository.save(category);
    }
    public Category update(Integer id, Category category){
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("Ko tim thay danh muc"));
        existingCategory.setTitle(category.getTitle());
        existingCategory.setSlug(category.getSlug());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setThumbnail(category.getThumbnail());
        existingCategory.setStatus(category.getStatus());
        existingCategory.setParent(category.getParent());

        return categoryRepository.save(existingCategory);
    }

    public void delete(Integer id){
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("Ko tim thay danh muc"));
        existingCategory.setDeleted(true);
        existingCategory.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(existingCategory);

    }

}
