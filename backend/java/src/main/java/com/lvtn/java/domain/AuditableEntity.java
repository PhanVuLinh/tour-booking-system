package com.lvtn.java.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Setter
@Getter
public class AuditableEntity extends BaseEntity{

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deletedAt",nullable = true)
    private LocalDateTime deletedAt;

    @Column(nullable = true)
    private Integer createdBy;

    @Column(nullable = true)
    private Integer updatedBy;

    @Column(nullable = true)
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "createdAt",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt",nullable = false)
    private LocalDateTime updatedAt;

}
