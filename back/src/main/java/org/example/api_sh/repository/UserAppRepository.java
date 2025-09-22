package org.example.api_sh.repository;

import org.example.api_sh.entity.UserApp;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAppRepository extends CrudRepository<UserApp, Long> {
    Optional<UserApp> findByEmail(String email);
}
