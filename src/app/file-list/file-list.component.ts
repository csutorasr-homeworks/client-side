import { Component, OnInit } from '@angular/core';
import { DriveService } from '../core/drive.service';
import { Observable } from 'rxjs/Observable';
import { UploadEvent } from 'ngx-file-drop';

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

  public dropped(event: UploadEvent) {
    if (event.files.length === 0) {

    } else if (event.files.length > 1) {

    } else {
      const droppedFile = event.files[0];
      console.log(droppedFile);
    }

    // for (const droppedFile of event.files) {

    //   // Is it a file?
    //   if (droppedFile.fileEntry.isFile) {
    //     const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    //     fileEntry.file((file: File) => {

    //       // Here you can access the real file
    //       console.log(droppedFile.relativePath, file);

    //       /**
    //       // You could upload it like this:
    //       const formData = new FormData()
    //       formData.append('logo', file, relativePath)

    //       // Headers
    //       const headers = new HttpHeaders({
    //         'security-token': 'mytoken'
    //       })

    //       this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
    //       .subscribe(data => {
    //         // Sanitized logo returned from backend
    //       })
    //       **/

    //     });
    //   } else {
    //     // It was a directory (empty directories are added, otherwise only files)
    //     const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
    //     console.log(droppedFile.relativePath, fileEntry);
    //   }
    // }
  }

}
