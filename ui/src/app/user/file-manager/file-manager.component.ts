import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
import { FileModel, PageResponse } from '../../models/file';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html'
})
export class FileManagerComponent implements OnInit {

  files: FileModel[] = [];
  selectedFile: File | null = null;
  userId: number = 0;
  loading: boolean = false;
  uploading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 5;

  constructor(
    private fileService: FileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadFiles();
  }

  loadFiles(): void {
    this.loading = true;
    this.fileService.getUserFiles(
      this.userId,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (data: PageResponse) => {
        this.files         = data.content;
        this.totalPages    = data.totalPages;
        this.totalElements = data.totalElements;
        this.loading       = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load files!';
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first!';
      return;
    }

    this.uploading = true;
    this.errorMessage = '';

    this.fileService.uploadFile(
      this.selectedFile,
      this.userId
    ).subscribe({
      next: () => {
        this.successMessage = 'File uploaded successfully!';
        this.uploading = false;
        this.selectedFile = null;
        this.loadFiles();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to upload file!';
        this.uploading = false;
      }
    });
  }

  onDownload(file: FileModel): void {
    this.fileService.downloadFile(
      file.id!,
      this.userId
    ).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href    = url;
        a.download = file.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Failed to download file!';
      }
    });
  }

  onDelete(fileId: number): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(fileId, this.userId).subscribe({
        next: () => {
          this.successMessage = 'File deleted successfully!';
          this.loadFiles();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: () => {
          this.errorMessage = 'Failed to delete file!';
        }
      });
    }
  }

  getFileSizeLabel(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('image'))       return 'bi-file-image';
    if (fileType.includes('pdf'))         return 'bi-file-pdf';
    if (fileType.includes('word'))        return 'bi-file-word';
    if (fileType.includes('excel') ||
        fileType.includes('spreadsheet')) return 'bi-file-excel';
    if (fileType.includes('zip') ||
        fileType.includes('compressed'))  return 'bi-file-zip';
    return 'bi-file-earmark';
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadFiles();
    }
  }

  getPages(): number[] {
    return Array.from(
      { length: this.totalPages }, 
      (_, i) => i
    );
  }
}