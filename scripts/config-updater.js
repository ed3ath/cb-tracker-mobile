const fs = require('fs-extra');
const fetch = require('node-fetch');

const APPCONFIG_URL = 'https://raw.githubusercontent.com/CryptoBlades/config/main/app-config.json';

async function updateAppConfig() {
  console.log('[APPCONFIG-UPDATER]', 'Updating app-config.json...');
  const appConfig = await fetch(`${APPCONFIG_URL}`).then((res) => res.json());
  fs.writeJsonSync(`./app-config.json`, appConfig);
  console.log('[APPCONFIG-UPDATER]', 'Done updating app-config.json');
}

updateAppConfig();
