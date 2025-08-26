import { Injectable } from '@angular/core';
import { UploadFileRequest } from '../model/upload-file-request.model';
import { ApiService } from './api.service';
import { UploadFileResponse } from '../model/upload-file-response.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) { }

  uploadFile(uploadFileRequest: UploadFileRequest): Promise<UploadFileResponse> {
    const url = `file`;
    return this.apiService.doPost(url, uploadFileRequest);
  }

  deleteFile(key: string): Promise<void> {
    const url = `file/${key}`;
    return this.apiService.doDelete(url);
  }
}
