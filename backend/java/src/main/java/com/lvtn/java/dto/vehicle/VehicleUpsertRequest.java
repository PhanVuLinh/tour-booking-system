package com.lvtn.java.dto.vehicle;

import com.lvtn.java.domain.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpsertRequest {
    private String name;
    private VehicleType vehicleType;
}
