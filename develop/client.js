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
    const results = await client.search({
        query : 'test',
        timeOut: 300
    })
    console.log(results)
}
setTimeout(()=>{
    search();
}, 2000);

client.open();

window.foxql = client;