package com.lvtn.java.modules.user.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.modules.role.entity.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "accounts")
@Data

public class Account extends AuditableEntity {
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    private String fullName;
    private String email;
    @Column(length = 1000)
    private String password;
    @Column(length = 1000)
    private String token;
    private String phone;
    private String avatar;
    private String jobTitle;
    private String status="active";

}
