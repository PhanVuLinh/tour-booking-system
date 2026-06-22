package com.lvtn.java.service.impl;

import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.lvtn.java.domain.entity.Category;
import com.lvtn.java.dto.category.CategoryResponse;
import com.lvtn.java.dto.category.CategoryUpsertRequest;
import com.lvtn.java.repository.CategoryRepository;
import com.lvtn.java.repository.TourRepository;
import com.lvtn.java.service.CategoryService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final ModelMapper mapper;
    private final TourRepository tourRepository;

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) return "";
        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("");
        return slug.toLowerCase()
                   .replace("đ", "d")
                   .replaceAll("[^a-z0-9]+", "-")
                   .replaceAll("^-|-$", "");
    }

    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = mapper.map(category, CategoryResponse.class);
        int count = tourRepository.countByCategoryIdAndDeletedFalse(category.getId());
        response.setTourCount(count);
        if (category.getParent() != null) {
            response.setParentId(category.getParent().getId());
        }
        return response;
    }

    @Override
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse findById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return mapToResponse(category);
    }

    @Override
    public CategoryResponse create(CategoryUpsertRequest request) {
        mapper.typeMap(CategoryUpsertRequest.class, Category.class)
                .addMappings(m -> m.skip(Category::setParent));

        Category category = mapper.map(request, Category.class);
        category.setSlug(generateSlug(request.getTitle()));

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            category.setParent(parent);
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(Integer id, CategoryUpsertRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));

        existingCategory.setTitle(request.getTitle());
        existingCategory.setSlug(generateSlug(request.getTitle()));
        existingCategory.setDescription(request.getDescription());
        existingCategory.setThumbnail(request.getThumbnail());
        existingCategory.setStatus(request.getStatus());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục cha với ID: " + request.getParentId()));
            existingCategory.setParent(parent);
        } else {
            existingCategory.setParent(null);
        }

        return mapToResponse(categoryRepository.save(existingCategory));
    }

    @Override
    public void delete(Integer id) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));
        int tourCount = tourRepository.countByCategoryIdAndDeletedFalse(id);
        if (tourCount > 0) {
            throw new RuntimeException("Không thể chuyển vào thùng rác! Danh mục này đang chứa " + tourCount + " tour hoạt động.");
        }
        existingCategory.setDeleted(true);
        existingCategory.setDeletedAt(LocalDateTime.now());
        categoryRepository.save(existingCategory);
    }
    @Override
    public List<CategoryResponse> findAllActive() {
        return categoryRepository.findByDeletedFalse().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<CategoryResponse> findAllTrash() {
        return categoryRepository.findByDeletedTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public void restore(Integer id) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));

        existingCategory.setDeleted(false);
        existingCategory.setDeletedAt(null);
        categoryRepository.save(existingCategory);
    }

    @Override
    public void hardDelete(Integer id) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với ID: " + id));

        categoryRepository.delete(existingCategory);
    }
}