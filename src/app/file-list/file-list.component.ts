import { Component, OnInit } from '@angular/core';
import { DriveService } from '../core/drive.service';
import { Observable } from 'rxjs/Observable';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { MatSnackBar } from '@angular/material';

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

  constructor(private driveService: DriveService, private snackBar: MatSnackBar) { }

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

  public dropped(event: UploadEvent) {
    if (event.files.length === 0) {
      this.snackBar.open('Nem található fájl a dobásban.');
    } else if (event.files.length > 1) {
      this.snackBar.open('Csak egy fájl tölthető fel egyszerre.');
    } else {
      const droppedFile = event.files[0];
      if (!droppedFile.fileEntry.isFile) {
        this.snackBar.open('Csak fájl tölthető fel.');
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file) => {
          this.driveService.uploadFile(file, droppedFile.relativePath);
        });
      }
    }
  }

}
