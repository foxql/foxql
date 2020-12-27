const name = 'onSearch';


async function listener(data)
{ 
    const targetCollections = data.collections;

    let resultMap = {};

    targetCollections.forEach( collection => {
        const findCollection = this.database.useCollection(collection);
        resultMap[collection] = findCollection.search(data.query)
    });

    const to = data._by;

    this.peer.send(to, {
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