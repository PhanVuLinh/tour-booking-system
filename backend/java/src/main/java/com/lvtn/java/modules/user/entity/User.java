package com.lvtn.java.domain.entity;

import com.lvtn.java.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "fullName")
    private String fullName;

    private String email;

    private String phone;

    private String password;

    private String token;

    private String status="active";

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deletedAt",nullable = true)
    private LocalDateTime deletedAt;

    @Column(nullable = true)
    private Integer deletedBy;

    @CreationTimestamp
    @Column(name = "createdAt",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt",nullable = false)
    private LocalDateTime updatedAt;

}
