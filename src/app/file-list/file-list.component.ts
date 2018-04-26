import { Component, OnInit } from '@angular/core';
import { DriveService } from '../core/drive.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  loading: Observable<boolean>;
  folderNames: string[];
  lastPage: Observable<boolean>;
  files: Observable<gapi.client.drive.File[]>;
  folders: Observable<gapi.client.drive.File[]>;

  constructor(private driveService: DriveService) { }

  /**
   * Sets the observables to the given values.
   */
  ngOnInit() {
    this.load();
    this.files = this.driveService.files;
    this.folders = this.driveService.folders;
    this.lastPage = this.driveService.lastPage;
    this.folderNames = this.driveService.folderNames;
    this.loading = this.driveService.loading;
  }

  /**
   * Load files of drive.
   */
  load() {
    this.driveService.getFiles();
  }

  /**
   * Loads the next page of files.
   */
  loadNextPage() {
    this.driveService.getNextPage();
  }

  /**
   * Nofities service to download file.
   * @param file File to download.
   */
  download(file: gapi.client.drive.File) {
    this.driveService.downloadFile(file);
  }

  /**
   * Nofities service to change to a directory.
   * @param file The directory.
   */
  changeDirectory(file: gapi.client.drive.File) {
    this.driveService.changeDirectory(file);
  }

  /**
   * Notifies service to go one directory upper.
   */
  upDirectory() {
    this.driveService.upDirectory();
  }

}
