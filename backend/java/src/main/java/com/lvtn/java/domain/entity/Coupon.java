package com.lvtn.java.domain.entity;

import com.lvtn.java.domain.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon extends AuditableEntity {

    @Column(unique = true, nullable = false)
    private String code;

    private Double discountPercentage;
    private Double maxDiscountAmount;
    private Integer quantity;
    private Integer usedCount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;

}