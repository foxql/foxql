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

client.use('documentLengthInterval', {
    active : true,
    interval : 1000,
    maxDocumentsInCollections : [
        {
            collection : 'entrys',
            maxDocument : 1
        },
        {
            collection : 'webPage',
            maxDocument : 100
        }
    ]
});

async function search()
{
    const results = await client.search({
        query : 'foxql',
        timeOut: 0
    })
    console.log(results)
}
search();

client.open();

window.foxql = client;