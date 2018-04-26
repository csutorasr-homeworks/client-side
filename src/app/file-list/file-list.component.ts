import { Component, OnInit } from '@angular/core';
import { DriveService } from '../core/drive.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  lastPage: Observable<boolean>;
  files: Observable<gapi.client.drive.File[]>;
  folders: Observable<gapi.client.drive.File[]>;

  constructor(private driveService: DriveService) { }

  ngOnInit() {
    this.load();
    this.files = this.driveService.files;
    this.folders = this.driveService.folders;
    this.lastPage = this.driveService.lastPage;
  }

  load() {
    this.driveService.getFiles();
  }

  loadNextPage() {
    this.driveService.getNextPage();
  }

  download(file: gapi.client.drive.File) {
    this.driveService.downloadFile(file);
  }

}
