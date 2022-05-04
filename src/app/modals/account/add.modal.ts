import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import web3Utils from 'web3-utils';

import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-modal',
  templateUrl: './add.modal.html',
  styleUrls: ['./add.modal.scss'],
})
export class AddModalComponent implements OnInit {
  _name: string;
  _address: string;
  _accounts: string[];
  _names: any;

  constructor(
    private _modalCtrl: ModalController,
    private _storage: Storage,
    private _utils: UtilsService,
    private _toaster: ToastController,
  ) {}

  async ngOnInit() {
    this._accounts = (await this._storage.get('accounts')) || [];
    this._names = (await this._storage.get('names')) || {};
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  async addAccount() {
    if (this._name && this._address) {
      if (!web3Utils.isAddress(this._address)) {
        return this.displayToaster('Invalid Address');
      }
      if (this._accounts.includes(this._address)) {
        return this.displayToaster('The address already exists.');
      }
      this._accounts.push(this._address);
      this._names[this._address] = this._name;
      await this._storage.set('accounts', this._accounts);
      await this._storage.set('names', this._names);
      this.displayToaster(
        `${this._utils.addressPrivacy(this._address)} has been added.`
      );
      this._modalCtrl.dismiss();
    }
  }

  async displayToaster(message) {
    this._toaster
      .create({
        message,
        position: 'top',
        cssClass: 'toaster',
        duration: 2000,
        buttons: [
          {
            side: 'end',
            text: 'Close',
            role: 'cancel',
            handler: () => {
              console.log('');
            },
          },
        ],
      })
      .then((toast) => {
        toast.present();
      });
  }
}
