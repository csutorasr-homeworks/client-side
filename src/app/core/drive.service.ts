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
  private nextPageToken: string;

  constructor(private http: HttpClient) {
    this.files = this.filesSubject.asObservable();
  }

  public getFiles() {
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`).subscribe(data => {
      this.filesSubject.next(data.files);
      this.nextPageToken = data.nextPageToken;
      subscription.unsubscribe();
    });
  }

  public getNextPage() {
    const subscription = this.http.get<FileList>(`${this.API_URL}/files`, {
      params: {
        pageToken: this.nextPageToken,
      }
    }).subscribe(data => {
      this.filesSubject.next([...this.filesSubject.value, ...data.files]);
      this.nextPageToken = data.nextPageToken;
      subscription.unsubscribe();
    });
  }

}
