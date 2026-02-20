package com.navy.communication.repository;

import com.navy.communication.model.User;
import com.navy.communication.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndStatus(String email, UserStatus status);
}
