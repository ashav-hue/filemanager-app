package com.example.filemanagerapp.service;

import com.example.filemanagerapp.dto.FileDTO;
import com.example.filemanagerapp.entity.FileEntity;
import com.example.filemanagerapp.entity.User;
import com.example.filemanagerapp.repository.FileRepository;
import com.example.filemanagerapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    // Upload file
    public FileDTO uploadFile(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setUploadedAt(LocalDateTime.now());
        fileEntity.setUser(user);

        return convertToDTO(fileRepository.save(fileEntity));
    }

    // Get paginated files for user
    public Page<FileDTO> getUserFiles(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("uploadedAt").descending());
        return fileRepository.findByUserId(userId, pageable)
                .map(this::convertToDTO);
    }

    // Download file
    public FileEntity downloadFile(Long fileId, Long userId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Make sure file belongs to this user
        if (!file.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to file");
        }

        return file;
    }

    // Delete file
    public void deleteFile(Long fileId, Long userId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Make sure file belongs to this user
        if (!file.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to file");
        }

        fileRepository.deleteById(fileId);
    }

    // Convert Entity to DTO
    private FileDTO convertToDTO(FileEntity file) {
        FileDTO dto = new FileDTO();
        dto.setId(file.getId());
        dto.setFileName(file.getFileName());
        dto.setFileType(file.getFileType());
        dto.setFileSize(file.getFileSize());
        dto.setUploadedAt(file.getUploadedAt());
        dto.setUserId(file.getUser().getId());
        return dto;
    }
}