package com.lvtn.java.repository;

import com.lvtn.java.domain.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Account> findByDeletedFalse();
    List<Account> findByDeletedTrue();
}
