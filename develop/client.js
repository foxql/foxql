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

async function search()
{
    const results = await client.search('test')
    console.log(results)
}

search();

client.open();

window.foxql = client;