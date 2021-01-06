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

    const doc = this.database.useCollection(collection).getDoc(id);

    if(data._simulate && doc) {
        return true;
    }

    this.peer.send(by, {
        listener : data.listener,
        data :{
            document : doc
        }
    });


}

export default {
    name : name,
    listener : listener
}