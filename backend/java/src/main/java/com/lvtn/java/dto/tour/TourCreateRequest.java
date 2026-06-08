package com.lvtn.java.dto.tour;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TourCreateRequest {
    private Integer categoryId;
    private String title;
    private String description;
    private String time;
    private String thumbnail;
    private String status;
    private Integer createdBy;
    private Integer price;
}