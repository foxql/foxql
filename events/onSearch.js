const name = 'onSearch';


async function listener(data)
{ 
    const results = this.indexs.search(data.query)
    const to = data._by;
    if(results.length <= 0) {return}

    this.peer.send(to, {
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