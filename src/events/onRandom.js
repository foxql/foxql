import middleware from '../utils/middleware.js';

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 5
});

const name = 'onRandom';


async function listener(data)
{ 
    if(data._simulate) return true;
    
    const by = data._by;
    eventMiddleware.up(by);
    const status = eventMiddleware.status(by);

    if(status.warning){
        if(this.peer.connections[by] !== undefined) {
            this.dropPeer(by);
        }
        return;
    }

    if(data.listener === undefined) return; 

    let limit = data.limit || 10;
    if(limit > 20) {
        limit = 20;
    }

    const collection = data.collection || '';
    if(!this.currentCollections.includes(collection)){
        return false;
    }

    const dbCollection = this.database.useCollection(collection);
    let documents = Object.values(dbCollection.documents);
    let documentLength = documents.length;
    if(documentLength<=0) return false;

    if(documentLength > 100) {
        documents = document.slice(0,100)
        documentLength = 100;
    }

    let results = [];
    let resultIdMap = {};

    if(documentLength <= limit) {
        results = documents;
    }else{
        for(let i = 0; i < limit; i++){
            const index = Math.floor(Math.random() * documentLength);
            const document = documents[index];

            if(resultIdMap[document[dbCollection.ref]] === undefined) {
                results.push(document)
                documents.splice(index, 1);
                documentLength--;
            }
        }
    }

    this.peer.send(by, {
        listener : data.listener,
        data :{
            results : results
        }
    });
}

export default {
    name : name,
    listener : listener
}