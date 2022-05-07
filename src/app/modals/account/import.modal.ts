import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { UtilsService } from 'src/app/services/utils.service';
import { EventsService } from 'src/app/services/event.service';

@Component({
  selector: 'app-modal',
  templateUrl: './import.modal.html',
  styleUrls: ['./import.modal.scss'],
})
export class ImportModalComponent {
  _file: any;

  constructor(
    private _modalCtrl: ModalController,
    private _storage: Storage,
    private _utils: UtilsService,
    private _events: EventsService
  ) {}

  closeModal() {
    this._modalCtrl.dismiss();
  }

  async importData() {
    const fr = new FileReader();
    fr.readAsText(this._file);
    fr.addEventListener('load', async (res) => {
      const { accounts, names, network, currency } = JSON.parse(
        res.target.result.toString()
      );
      await this._storage.set('accounts', JSON.parse(accounts));
      await this._storage.set('names', JSON.parse(names));
      await this._storage.set('network', network.toUpperCase());
      await this._storage.set('currency', currency);
      this._utils.displayToaster('Data successfully imported.');
      this._events.publish('accountRefresh');
    });
    this._modalCtrl.dismiss();
  }

  changeFile(event) {
    this._file = event.target.files[0];
  }
}
