export interface FileModel {
  id?: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  userId: number;
}

export interface PageResponse {
  content: FileModel[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}