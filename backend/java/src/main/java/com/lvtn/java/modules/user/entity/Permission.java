package com.lvtn.java.modules.user.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "permissions")
public class Permission extends AuditableEntity {
    private String name;
    private String permissionKey;
    private String permissionGroup;
    private String description;
}
