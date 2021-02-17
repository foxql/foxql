import middleware from '../utils/middleware.js';

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 5
});


const name = 'onSearch';


async function listener(data)
{ 
    if(data.query === undefined) {
        return true;
    }
    const by = data._by;
    eventMiddleware.up(by);
    const status = eventMiddleware.status(by);

    if(status.warning){
        if(this.peer.connections[by] !== undefined) {
            this.dropPeer(by);
        }
        return;
    }

    const targetCollection = data.collection || false;

    if(!targetCollection) {
        this.dropPeer(by);
        return;
    }

    const findCollection = this.database.useCollection(targetCollection);
    let results = findCollection.search(data.query)

    if(data._simulate) {
        return results.length > 0;
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