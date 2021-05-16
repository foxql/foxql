const name = 'onDocumentByTimeDiff';

async function listener(data)
{
    const by = data._by;
    const collectionName = data.collection;

    const collection = this.database.useCollection(collectionName) || false;

    if(!collection){
        return false;
    }
    const diffSecond = data.timeDiff || 0;;

    const currentTime = new Date();

    let filteredDocuments = Object.values(collection.documents).filter((doc)=>{
        const diff = ( currentTime - new Date(doc.createDate).getTime() ) / 1000;
        
        return diff <= diffSecond;
    })

    if(filteredDocuments.length <= 0) {
        return false;
    }
    if(data._simulate) {
        return true;
    }

    this.peer.send(by, {
        listener : data.listener,
        data :{
            results : filteredDocuments
        }
    });



}


export default {
    name : name,
    listener : listener
}