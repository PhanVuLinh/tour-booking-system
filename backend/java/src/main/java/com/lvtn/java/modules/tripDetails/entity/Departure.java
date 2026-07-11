package com.lvtn.java.domain.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.modules.tour.entity.Tour;
import com.lvtn.java.modules.user.entity.Account;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "departures")
public class Departure extends AuditableEntity {
    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tourId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id")
    private Account guide;

    @Column(name = "startDate")
    private LocalDateTime startTime;

    @Column(name = "endDate")
    private LocalDateTime endDate;

    @Column
    private BigDecimal priceAdult;

    @Column
    private BigDecimal priceChildren;

    @Column
    private BigDecimal priceBaby;

    @Column
    private int stockAdult;

    @Column
    private int stockChildren;

    @Column
    private int stockBaby;

    @Column(name = "status")
    private String status = "active";

    @Column(name = "discountPercentage")
    private Integer discount;

    @Column(name = "departureFrom")
    private String departureFrom;

}
