package com.lvtn.java.modules.user.entity;

import com.lvtn.java.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "roles")
@Data
public class Role extends BaseEntity {
    private String name;
    private String description;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions;

    @Column(columnDefinition = "boolean default false")
    private Boolean deleted = false;

    @Column(name = "deletedAt",nullable = true)
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "createdAt",nullable = false,updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt",nullable = false)
    private LocalDateTime updatedAt;
}
