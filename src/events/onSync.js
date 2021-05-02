const name = 'onSync';


async function listener(data)
{
    const by = data._by;

    const offeredEntrysCollection = this.database.useCollection('entry_offers');

    
    if(data._simulate) {

        if(offeredEntrysCollection.documentLength <= 0) {
            return false;
        }

        return true;
    }

    const entrysCollection = this.database.useCollection('entrys');

    const offeredEntrys = Object.values(
        offeredEntrysCollection.documents
    );

    offeredEntrys.forEach(item => {
        let entry = entrysCollection.getDoc(item.entryId)
        if(entry) {
            if(item.recieverCount >= item.destroyRecieveCount ) {
                offeredEntrysCollection.deleteDoc(item.entryOfferId)
                return true;
            }

            this.peer.send(by, {
                listener : data.listener,
                data :{
                    results : entry
                }
            });
            item.recieverCount  += 1;
        }
    })

    return true;
}


export default {
    listener : listener,
    name : name
}