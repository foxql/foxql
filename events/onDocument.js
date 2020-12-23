const name = 'onDocument';


async function listener(document)
{ 
    this.indexs.addDoc(
        document
    )
}

export default {
    name : name,
    listener : listener
}