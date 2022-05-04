const fs = require('fs-extra');
const fetch = require('node-fetch');

const ABI_URL = 'https://app.cryptoblades.io/abi/';
const ABIS = [
  'CryptoBlades',
  'IERC20',
  'Characters',
  'Weapons',
  'SimpleQuests',
  'Treasury',
  'IStakingRewards',
  'SkillStakingRewardsUpgradeable',
  'SkillStakingRewardsUpgradeable90',
  'SkillStakingRewardsUpgradeable180'
];

async function updateMainAbi() {
  console.log('[ABI-UPDATER]', 'Updating ABIs...');
  fs.ensureDirSync('./src/data/abi/');
  await Promise.all(
    ABIS.map(async (name) => {
      const contract = await fetch(`${ABI_URL}/${name}.json`).then((res) =>
        res.json(),
      );
      fs.writeJsonSync(`./src/data/abi/${name}.json`, contract.abi);
    }),
  );
  console.log('[ABI-UPDATER]', 'Done updating ABIs');
}

updateMainAbi();
