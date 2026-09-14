package com.lvtn.java.modules.role.repository;

import com.lvtn.java.modules.role.entity.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    @EntityGraph(attributePaths = {"permissions"})
    List<Role> findByDeleted(Integer deleted);

    @Override
    @EntityGraph(attributePaths = {"permissions"})
    List<Role> findAll();

    @Override
    @EntityGraph(attributePaths = {"permissions"})
    Optional<Role> findById(Integer id);
}
