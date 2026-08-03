package com.lvtn.java.dto.category;

import com.lvtn.java.domain.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUpsertRequest {
    private Integer parentId;
    private String title;
    private String slug;
    private String description;
    private String thumbnail;
    private String status = "active";
}