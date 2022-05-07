import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UtilsService } from 'src/app/services/utils.service';
import { EventsService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-modal',
  templateUrl: './rename.modal.html',
  styleUrls: ['./rename.modal.scss'],
})
export class RenameModalComponent implements OnInit {
  @Input() name: string;
  @Input() address: string;
  _name: string;
  _names: any;

  constructor(
    private _modalCtrl: ModalController,
    private _storage: StorageService,
    private _utils: UtilsService,
    private _events: EventsService
  ) {}

  async ngOnInit() {
    this._names = (await this._storage.get('names')) || {};
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  setName(newName) {
    this._name = newName;
  }

  async renameAccount() {
    if (!this._name) {
      this._name = this.name;
    }
    this._names[this.address] = this._name;
    await this._storage.set('names', this._names);
    this._utils.displayToaster('Your changes has been saved.');
    this._modalCtrl.dismiss();
    this._events.publish('accountRefresh');
  }
}
