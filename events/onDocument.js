import middleware from '../core/middleware.js';

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 1
});

const name = 'onDocument';


async function listener(data)
{ 

    if(data._simulate) {
        return true;
    }

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

    console.log(status);

    const collection = data.collection;

    this.database.useCollection(collection).addDoc(
        data.document
    )
}

export default {
    name : name,
    listener : listener
}