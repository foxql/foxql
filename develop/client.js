import {foxql} from '../index.js';

const client = new foxql();

client.listenEvents([
    'onDocument',
    'onSearch',
    'onRandom',
    'onDocumentByRef'
])


client.openNativeCollections();

client.use('storageOptions', {
    saveInterval : false
});

client.use('documentLengthInterval', {
    active : true,
    interval : 1000,
    maxDocumentsInCollections : [
        {
            collection : 'entrys',
            maxDocument : 30
        },
        {
            collection : 'webPage',
            maxDocument : 100
        }
    ]
});

client.open();

client.database.useCollection('entrys').addDoc({
    title : 'test document',
    content : 'test için oluşturulmuş bir içerik',
    createDate : new Date('2021-01-01')
});

async function query() {

    const collection = client.database.useCollection('entrys');

    const queryObject = {
        ref : 'ec59d113d2ef762b40928419323abaaafa64218b70056e51de730731d6192a0e',
        collection : 'entrys'
    };

    const results = await client.sendEvent(queryObject, {
        timeOut : 1200, // destroy 1.2s listener
        peerListener : 'onDocumentByRef',
        documentPool : Object.values(collection.documents)
    });

    console.log(results);
}
window.q = query;
window.foxql = client;