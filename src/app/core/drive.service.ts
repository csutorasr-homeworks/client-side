import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, exhaustMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import FileList = gapi.client.drive.FileList;
import GoogleFile = gapi.client.drive.File;

@Injectable()
export class DriveService {
  private readonly API_URL = 'https://www.googleapis.com/drive/v3';
  private readonly UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

  public files: Observable<gapi.client.drive.File[]>;
  private filesSubject = new BehaviorSubject([]);
  public folders: Observable<gapi.client.drive.File[]>;
  private foldersSubject = new BehaviorSubject([]);
  public lastPage: Observable<boolean>;
  private lastPageSubject = new BehaviorSubject(true);
  public loading: Observable<boolean>;
  private loadingSubject = new BehaviorSubject(false);
  private nextPageToken: string;
  private selectedFolders = ['root'];
  public folderNames = [];

  private get currentFolder() {
    return this.selectedFolders[this.selectedFolders.length - 1];
  }

  constructor(private http: HttpClient) {
    this.files = this.filesSubject.asObservable();
    this.folders = this.foldersSubject.asObservable();
    this.lastPage = this.lastPageSubject.asObservable();
    this.loading = this.loadingSubject.asObservable();
  }

  /**
   * Loads the files of the current directory.
   */
  public getFiles() {
    this.loadingSubject.next(true);
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`, {
      params: {
        orderBy: 'folder,modifiedTime',
        q: `'${this.currentFolder}' in parents`,
        spaces: 'drive',
      }
    }).subscribe(data => {
      this.loadingSubject.next(false);
      this.filesSubject.next(data.files.filter(x => x.mimeType !== 'application/vnd.google-apps.folder'));
      this.foldersSubject.next(data.files.filter(x => x.mimeType === 'application/vnd.google-apps.folder'));
      this.setNextPageToken(data.nextPageToken);
      subscription.unsubscribe();
    }, () => {
      this.loadingSubject.next(false);
    });
  }

  /**
   * Loads the next page of the files.
   */
  public getNextPage() {
    this.loadingSubject.next(true);
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`, {
      params: {
        pageToken: this.nextPageToken,
        orderBy: 'folder,modifiedTime',
        spaces: 'drive',
        q: `'${this.currentFolder}' in parents`,
      }
    }).subscribe(data => {
      this.loadingSubject.next(false);
      this.filesSubject.next([
        ...this.filesSubject.value,
        ...data.files.filter(x => x.mimeType !== 'application/vnd.google-apps.folder'),
      ]);
      this.foldersSubject.next([
        ...this.foldersSubject.value,
        ...data.files.filter(x => x.mimeType === 'application/vnd.google-apps.folder'),
      ]);
      this.setNextPageToken(data.nextPageToken);
      subscription.unsubscribe();
    }, () => {
      this.loadingSubject.next(false);
    });
  }

  /**
   * Downloads a file from Drive.
   * @param file The file to download.
   */
  public downloadFile(file: gapi.client.drive.File) {
    this.loadingSubject.next(true);
    const subscription = this.http.get(`${this.API_URL}/files/${file.id}`, {
      responseType: 'blob',
      params: {
        alt: 'media',
      }
    }).subscribe(res => {
      this.loadingSubject.next(false);
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
    }, () => {
      this.loadingSubject.next(false);
    });
  }

  /**
   * Uploads a file to Drive.
   * @param file The file to upload.
   */
  public uploadFile(file: File, relativePath: string) {
    this.loadingSubject.next(true);
    const subscription = this.http.post(`${this.UPLOAD_API_URL}?uploadType=resumable`, {
      name: file.name,
      parents: [this.currentFolder],
    }, { observe: 'response' }).pipe(
      exhaustMap(data => this.http.patch<GoogleFile>(data.headers.get('Location'), file))
    ).subscribe(data => {
      this.loadingSubject.next(false);
      this.getFiles();
      subscription.unsubscribe();
    }, () => {
      this.loadingSubject.next(false);
    });
  }

  private setNextPageToken(token: string): void {
    this.nextPageToken = token;
    if (token) {
      this.lastPageSubject.next(true);
      this.getNextPage();
    } else {
      this.lastPageSubject.next(false);
    }
  }

  /**
   * Changes the current directory with setting foldernames.
   * @param file The directory to change to.
   */
  public changeDirectory(file: gapi.client.drive.File) {
    this.selectedFolders.push(file.id);
    this.folderNames.push(file.name);
    this.getFiles();
  }

  /**
   * Changes the directory one level upper.
   */
  public upDirectory() {
    if (this.selectedFolders.length > 1) {
      this.selectedFolders.pop();
      this.folderNames.pop();
      this.getFiles();
    }
  }

}
