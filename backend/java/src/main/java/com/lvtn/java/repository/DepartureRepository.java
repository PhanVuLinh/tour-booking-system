package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Departure;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartureRepository extends JpaRepository<Departure, Integer> {

}
