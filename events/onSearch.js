import middleware from '../core/middleware.js';

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 5
});


const name = 'onSearch';


async function listener(data)
{ 
    const by = data._by;
    eventMiddleware.up(by);
    const status = eventMiddleware.status(by);

    if(status.warning){
        if(this.peer.connections[by] !== undefined) {
            this.dropPeer(by);
        }
        return;
    }

    const targetCollections = data.collections;

    let resultMap = {};

    targetCollections.forEach( collection => {
        const findCollection = this.database.useCollection(collection);
        resultMap[collection] = findCollection.search(data.query)
    });

    this.peer.send(by, {
        listener : data.listener,
        data :{
            results : resultMap
        }
    });
}

export default {
    name : name,
    listener : listener
}