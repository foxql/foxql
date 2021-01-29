import middleware from '../core/middleware.js';

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 3
});

const name = 'onDocumentByRef';


async function listener(data)
{ 
    const by = data._by || false;

    if(!by) return;

    eventMiddleware.up(by);

    const status = eventMiddleware.status(by);

    if(status.warning){
        if(this.peer.connections[by] !== undefined) {
            this.dropPeer(by);
        }
        return;
    }


    const collection = data.collection;
    const id = data.ref || '';

    const targetIndex = this.database.useCollection(collection)

    let results = [];

    const doc = targetIndex.getDoc(id);

    if(doc){
        results.push(doc);
    }

    const match = data.match || false; 

    if(match) {
        
        const targetField = match.field || '';
        const findDocumentMatchingValue = doc[targetField] || false;

        const findMatchingIndex = targetIndex.indexs[targetField] || false;

        if(findMatchingIndex && findDocumentMatchingValue) {
            Object.keys(findMatchingIndex[findDocumentMatchingValue]).forEach((ref)=>{
                if(ref != doc[targetIndex.ref]){
                    results.push(
                        targetIndex.getDoc(ref)
                    );
                }
            })
        }




    }


    if(data._simulate && doc) {
        return true;
    }

    if(doc) {
        this.peer.send(by, {
            listener : data.listener,
            data :{
                results : results,
            }
        });

    }

    

}

export default {
    name : name,
    listener : listener
}