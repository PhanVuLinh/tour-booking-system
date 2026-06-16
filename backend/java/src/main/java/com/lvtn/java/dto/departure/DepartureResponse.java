package com.lvtn.java.dto.departure;

import com.lvtn.java.domain.entity.Tour;
import com.lvtn.java.domain.enums.DepartureStatus;
import com.lvtn.java.domain.enums.VehicleType;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartureResponse {
    private Integer id;
    private Integer tourId;
    private String tourTitle;

    private Integer vehicleId;
    private String vehicleName;
    private VehicleType vehicleType;

    private LocalDateTime startTime;
    private BigDecimal priceAdult;
    private BigDecimal priceChildren;
    private BigDecimal priceBaby;
    private int stockAdult;
    private int stockChildren;
    private int stockBaby;
    private Integer discount;
    private DepartureStatus status=DepartureStatus.OPEN;
    private Boolean deleted = false;
    private LocalDateTime deletedAt;
    private Integer createdBy;
    private Integer updatedBy;
    private Integer deletedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
