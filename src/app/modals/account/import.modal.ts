import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-modal',
  templateUrl: './import.modal.html',
  styleUrls: ['./import.modal.scss'],
})
export class ImportModalComponent implements OnInit {
  _data: any;

  constructor(
    private _modalCtrl: ModalController,
    private _storage: Storage,
  ) {}

  async ngOnInit() {}

  closeModal() {
    this._modalCtrl.dismiss();
  }

  async importData() {
      this._modalCtrl.dismiss();
  }
}
