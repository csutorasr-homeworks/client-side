import { Component, OnInit } from '@angular/core';
import { DriveService } from '../core/drive.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: Observable<gapi.client.drive.File[]>;

  constructor(private driveService: DriveService) { }

  ngOnInit() {
    this.load();
    this.files = this.driveService.files;
  }

  load() {
    this.driveService.getFiles();
  }

  loadNextPage() {
    this.driveService.getNextPage();
  }

}
