package com.lvtn.java.modules.user.repository;

import com.lvtn.java.modules.user.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    @EntityGraph(attributePaths = {"role"})
    Optional<Account> findByEmail(String email);

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = {"role"})
    List<Account> findByDeletedFalse();

    @EntityGraph(attributePaths = {"role"})
    List<Account> findByDeletedTrue();

    @Override
    @EntityGraph(attributePaths = {"role"})
    List<Account> findAll();

    @Override
    @EntityGraph(attributePaths = {"role"})
    Optional<Account> findById(Integer id);

    long countByDeletedFalse();
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
