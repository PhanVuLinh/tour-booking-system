package com.lvtn.java.service.impl;

import com.lvtn.java.domain.entity.Category;
import com.lvtn.java.repository.CategoryRepository;
import com.lvtn.java.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

}
