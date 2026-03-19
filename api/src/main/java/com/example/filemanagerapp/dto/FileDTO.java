package com.example.filemanagerapp.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FileDTO {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private Long userId;
}                                            