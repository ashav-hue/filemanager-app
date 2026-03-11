package com.example.filemanagerapp.repository;

import com.example.filemanagerapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (for login)
    Optional<User> findByEmail(String email);

    // List all users in ascending order by fullName
    List<User> findAllByOrderByFullNameAsc();

    // Check if email already exists
    boolean existsByEmail(String email);
}