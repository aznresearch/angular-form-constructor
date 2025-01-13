import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() message = 'Are you sure?';
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}
  ngOnInit(): void {}

  confirmAction() {
    this.confirm.emit(true);
  }

  cancelAction() {
    this.confirm.emit(false);
  }
}
