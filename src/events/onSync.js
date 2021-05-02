const name = 'onSync';


async function listener(data)
{
    console.log(data)
}


export default {
    listener : listener,
    name : name
}