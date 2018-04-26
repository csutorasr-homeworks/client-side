import { Component } from '@angular/core';

import { DriveService } from '../core/drive.service';

@Component({
  selector: 'app-refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.scss']
})
export class RefreshButtonComponent {

  constructor(private driveService: DriveService) { }

  load() {
    this.driveService.getFiles();
  }

}
