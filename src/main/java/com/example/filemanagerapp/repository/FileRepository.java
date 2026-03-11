package com.example.filemanagerapp.repository;

import com.example.filemanagerapp.entity.FileEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long> {

    // Get all files for a specific user (paginated)
    Page<FileEntity> findByUserId(Long userId, Pageable pageable);

    // Delete all files for a specific user
    void deleteByUserId(Long userId);
}