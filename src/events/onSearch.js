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

    const targetCollections = data.collections;

    let resultMap = {};
    let count = 0;

    targetCollections.forEach( collection => {
        const findCollection = this.database.useCollection(collection);
        resultMap[collection] = findCollection.search(data.query)
        count += resultMap[collection].length;
    });
    
    if(data._simulate) {
        return count > 0;
    }


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