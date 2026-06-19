package com.lvtn.java.domain.entity;

import com.lvtn.java.domain.AuditableEntity;
import com.lvtn.java.domain.enums.DepartureStatus;
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

    @Column(name = "startDate")
    private LocalDateTime startTime;

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

    @Enumerated(EnumType.STRING)
    @Column
    private DepartureStatus status=DepartureStatus.OPEN;

    @Column(name = "discount")
    private Integer discount;

}
