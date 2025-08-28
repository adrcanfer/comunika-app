import { Injectable } from '@angular/core';
import { S3FileContent } from '../model/s3-file-content.model';
import { ApiService } from './api.service';
import { UploadFileResponse } from '../model/upload-file-response.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) { }

  getFile(key: string): Promise<S3FileContent> {
    const url = `file/${key}`;
    return this.apiService.doGet(url);
  }
  
  uploadFile(uploadFileRequest: S3FileContent): Promise<UploadFileResponse> {
    const url = `file`;
    return this.apiService.doPost(url, uploadFileRequest);
  }

  deleteFile(key: string): Promise<void> {
    const url = `file/${key}`;
    return this.apiService.doDelete(url);
  }
}
