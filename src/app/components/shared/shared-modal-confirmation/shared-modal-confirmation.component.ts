import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shared-modal-confirmation',
  templateUrl: './shared-modal-confirmation.component.html',
  styleUrls: ['./shared-modal-confirmation.component.scss']
})
export class SharedModalConfirmationComponent implements OnInit {
  message = '';
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public modalRef: BsModalRef) {}
  ngOnInit(): void {}

  confirmModal() {
    this.confirm.emit(true);
    this.modalRef.hide();
  }

  closeModal() {
    this.modalRef.hide();
  }
}
