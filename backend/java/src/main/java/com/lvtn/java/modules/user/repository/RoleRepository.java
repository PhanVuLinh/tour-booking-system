package com.lvtn.java.modules.user.repository;

import com.lvtn.java.modules.user.entity.Role;
import org.springframework.data.repository.CrudRepository;

public interface RoleRepository extends CrudRepository<Role, Integer> {
}
