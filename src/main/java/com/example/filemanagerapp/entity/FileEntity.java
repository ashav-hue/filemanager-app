package com.example.filemanagerapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "files")
public class FileEntity {

@Id 
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(nullable = false)
private String fileName;

@Column(nullable = false)
private String filePath;

private Long fileSize;  

@Column(nullable = false)
private String fileType;

@Lob
@Column(nullable = false)
private byte[] fileData;

@Column(nullable = false)
private LocalDateTime uploadedAt;

@ManyToOne
@JoinColumn(name = "user_id", nullable = false)
private User user;

}
