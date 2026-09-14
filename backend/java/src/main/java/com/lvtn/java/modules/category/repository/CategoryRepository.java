package com.lvtn.java.modules.category.repository;

import com.lvtn.java.modules.category.entity.Category;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @EntityGraph(attributePaths = {"parent"})
    List<Category> findByTitleContainingIgnoreCaseAndDeletedFalse(String keyword);

    @EntityGraph(attributePaths = {"parent"})
    List<Category> findByDeletedFalse();

    @EntityGraph(attributePaths = {"parent"})
    List<Category> findByDeletedTrue();

    @Override
    @EntityGraph(attributePaths = {"parent"})
    List<Category> findAll();

    @Override
    @EntityGraph(attributePaths = {"parent"})
    Optional<Category> findById(Integer id);
}
