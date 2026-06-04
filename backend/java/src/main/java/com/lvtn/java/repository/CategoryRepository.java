package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByTitleContainingIgnoreCaseAndDeletedFalse(String keyword);
    List<Category>findByDeletedFalse();
}
