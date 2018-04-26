import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import FileList = gapi.client.drive.FileList;

@Injectable()
export class DriveService {
  private readonly API_URL = 'https://www.googleapis.com/drive/v3';

  public files: Observable<gapi.client.drive.File[]>;
  private filesSubject = new BehaviorSubject([]);
  public folders: Observable<gapi.client.drive.File[]>;
  private foldersSubject = new BehaviorSubject([]);
  public lastPage: Observable<boolean>;
  private lastPageSubject = new BehaviorSubject(true);
  private nextPageToken: string;
  private currentFolder = 'root';

  constructor(private http: HttpClient) {
    this.files = this.filesSubject.asObservable();
    this.folders = this.foldersSubject.asObservable();
    this.lastPage = this.lastPageSubject.asObservable();
  }

  public getFiles() {
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`, {
      params: {
        orderBy: 'folder,modifiedTime',
        q: `'${this.currentFolder}' in parents`,
        spaces: 'drive',
      }
    }).subscribe(data => {
      this.filesSubject.next(data.files.filter(x => x.mimeType !== 'application/vnd.google-apps.folder'));
      this.foldersSubject.next(data.files.filter(x => x.mimeType === 'application/vnd.google-apps.folder'));
      this.setNextPageToken(data.nextPageToken);
      subscription.unsubscribe();
    });
  }

  public getNextPage() {
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`, {
      params: {
        pageToken: this.nextPageToken,
        orderBy: 'folder,modifiedTime',
        spaces: 'drive',
        q: `'${this.currentFolder}' in parents`,
      }
    }).subscribe(data => {
      this.filesSubject.next([
        ...this.filesSubject.value,
        ...data.files.filter(x => x.mimeType !== 'application/vnd.google-apps.folder'),
      ]);
      this.foldersSubject.next([
        ...this.filesSubject.value,
        ...data.files.filter(x => x.mimeType === 'application/vnd.google-apps.folder'),
      ]);
      this.setNextPageToken(data.nextPageToken);
      subscription.unsubscribe();
    });
  }

  public downloadFile(file: gapi.client.drive.File) {
    const subscription = this.http.get(`${this.API_URL}/files/${file.id}`, {
      responseType: 'blob',
      params: {
        alt: 'media',
      }
    }).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      subscription.unsubscribe();
    });
  }

  setNextPageToken(token: string): void {
    this.nextPageToken = token;
    if (token) {
      this.lastPageSubject.next(true);
    } else {
      this.lastPageSubject.next(false);
    }
  }

}
