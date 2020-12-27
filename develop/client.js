import foxql from '../index.js';

const client = new foxql();

client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom'
])

client.openNativeCollections();


client.use('storageOptions', {
    saveInterval : true
});

client.open();

window.foxql = client;