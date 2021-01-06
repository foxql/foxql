import foxql from '../index.js';

const client = new foxql();

client.pushEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef'
])

client.openNativeCollections();


client.use('storageOptions', {
    saveInterval : true
});

async function search()
{
    const results = await client.search({
        query : 'test',
        timeOut: 100
    })
    console.log(results)
}
setTimeout(()=>{
    search();
}, 300);

client.open();

window.foxql = client;