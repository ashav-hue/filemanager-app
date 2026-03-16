package com.example.filemanagerapp.controller;

import com.example.filemanagerapp.dto.FileDTO;
import com.example.filemanagerapp.entity.FileEntity;
import com.example.filemanagerapp.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId) throws IOException {

                 System.out.println("Upload called!");
    System.out.println("UserId: " + userId);
    System.out.println("File: " + file.getOriginalFilename());
   
        fileService.uploadFile(file, userId);
    return ResponseEntity.ok()
    .contentType(MediaType.TEXT_PLAIN)
    .body("Uploaded successfully!");
}

    // Get paginated files for user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<FileDTO>> getUserFiles(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(fileService.getUserFiles(userId, page, size));
    }

    // Download file
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Object> downloadFile(
            @PathVariable Long fileId,
            @RequestParam Long userId) {
        FileEntity file = fileService.downloadFile(fileId, userId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFileName() + "\"")
                .body(file.getFileData());
    }

    // Delete file
    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(
            @PathVariable Long fileId,
            @RequestParam Long userId) {
        fileService.deleteFile(fileId, userId);
        return ResponseEntity.ok("File deleted successfully");
    }
}