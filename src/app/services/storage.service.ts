import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import IonicSecureStorageDriver from '@ionic-enterprise/secure-storage/driver';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  _storage: Storage;

  constructor(private storage: Storage) {}

  async init() {
    const encryptionKey = 'CBTracker#1';
    await this.storage.defineDriver(IonicSecureStorageDriver);
    this.storage.setEncryptionKey(encryptionKey);

    this._storage = await this.storage.create();
  }

  async get(key) {
    if (this._storage) {
      return await this._storage.get(key);
    }
    return undefined;
  }

  async set(key, value) {
    if (this._storage) {
      return await this._storage.set(key, value);
    }
  }
}
