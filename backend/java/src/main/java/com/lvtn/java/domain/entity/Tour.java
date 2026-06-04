package com.lvtn.java.domain.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Tour extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String title;
    private String slug;
    private String description;
    private String time;
    private String thumbnail;
    private String status;
}
