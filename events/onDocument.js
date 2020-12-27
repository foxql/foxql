const name = 'onDocument';


async function listener(data)
{ 
    const collection = data.collection;

    this.database.useCollection(collection).addDoc(
        data.document
    )
}

export default {
    name : name,
    listener : listener
}