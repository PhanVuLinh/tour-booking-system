package com.lvtn.java.dto.tour;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourResponse {
    private Integer id;
    private Integer categoryId;
    private String title;
    private String slug;
    private String description;
    private Integer price;
    private String time;
    private String thumbnail;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Boolean deleted = false;
    private LocalDateTime deletedAt;
    private Integer deletedBy;
}