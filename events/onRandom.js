const name = 'onRandom';


async function listener(data)
{ 
    if(data.listener === undefined) return; 

    const limit = data.limit || 3;
    if(limit > 3) {
        limit = 3;
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

    this.peer.send(data._by, {
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