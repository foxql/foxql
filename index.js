import foxqlIndex from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"
import storage from "./src/utils/storage.js";
import events from './src/events.js';
import tokenization from './src/utils/tokenization.js';
import consensus from './src/utils/consensus.js';
import nativeCollections from './src/collections.js';


class foxql {
    constructor(){
    
        this.storageOptions = {
            name : 'foxql-storage',
            interval : 100,
            saveInterval : false 
        }

        this.currentCollections = [];
        
        this.documentLengthInterval = {
            active : false,
            ms : 500,
            maxDocumentLength : 100
        };
    
        this.useAvaliableObjects = [
            'serverOptions',
            'storageOptions',
            'documentLengthInterval'
        ]
    
        this.databaseSaveProcessing = false

        this.database = new foxqlIndex(); 
        this.peer = new peer();
    }

    use(name, values)
    {
        if(this.useAvaliableObjects.includes(name)){
            this[name] = {...this[name], ...values}
        }
    }

    openNativeCollections()
    {
        nativeCollections.forEach(collection => {
            this.database.pushCollection(collection);
            const collectionName = collection.collectionName;
            this.currentCollections.push(collectionName);

            this.database.useCollection(collectionName).registerAnalyzer('tokenizer', tokenization);
        })
    }

    open()
    {
        const saveInterval = this.storageOptions.saveInterval || false;

        if(saveInterval) {
            this.storage = new storage(
                this.storageOptions
            );

            this.loadDumpOnStorage();
        }

        if(saveInterval) {
            this.indexDatabaseLoop();
        }
        
        if(this.documentLengthInterval.active) {
            this.deleteDatabaseLoop();
        }

        this.peer.open();

    }

    deleteDatabaseLoop()
    {
        const options = this.documentLengthInterval;

        setInterval(()=>{
            options.maxDocumentsInCollections.forEach(collectionOptions => {
                const targetCollection = collectionOptions.collection;
                const targetLength = collectionOptions.maxDocument;
                
                const collection = this.database.useCollection(targetCollection);
                if(collection.documentLength > targetLength) {
                    const lastDocumentRef = Object.keys(collection.documents).pop();
                    collection.deleteDoc(lastDocumentRef);
                }
            });
        }, options.interval);
    }

    loadDumpOnStorage()
    {
        const dump = this.storage.get();
        if(dump && typeof dump === 'string') {
            try {
                this.database.import(
                    JSON.parse(dump)
                );

                nativeCollections.forEach(collection => {
                    const collectionName = collection.collectionName;
                    this.database.useCollection(collectionName).registerAnalyzer('tokenizer', tokenization);
                })
            }catch(e)
            {
                throw Error(e);
            }
        }
    }

    indexDatabaseLoop()
    {
        setInterval(()=>{

            this.currentCollections.forEach(collection => {
                const targetCollection = this.database.collections[collection];
                if(targetCollection.waitingSave && !this.databaseSaveProcessing){
                    this.databaseSaveProcessing = true;
    
                    const dump = this.database.export();
                    this.storage.set(JSON.stringify(dump));
    
                    this.databaseSaveProcessing = false;
                    targetCollection.waitingSave = false;
                }  
            })
        }, this.storageOptions.interval);
    }


    pushEvents(list)
    {
        list.forEach( name => {
            const eventListener = events[name] || false;
            if(eventListener){
                this.peer.onPeer(eventListener.name, eventListener.listener.bind(this));
            }
        });     
    }


    async publishDocument(document, collection)
    {
        if(typeof collection !== 'string') return false;
        if(!this.currentCollections.includes(collection)) return false;

        await this.peer.broadcast({
            listener : 'onDocument',
            data : {
                document : document,
                collection : collection
            }
        });
    }   

    randomString()
    {
        return Math.random().toString(36).substring(0,30).replace(/\./gi, '');
    }

    async sendEvent(event, {peerListener, timeOut})
    {
        const eventConsensus = new consensus();
        const eventListenerName = this.randomString();

        event.listener = eventListenerName;

        await this.peer.broadcast({
            listener : peerListener,
            data : event
        });


        this.peer.onPeer(eventListenerName, async (data)=> {
            const peerResuls = data.results || [];
            const sender = data._by || false;
            if(peerResuls.length <= 0 || !sender) {
                return;
            }
            eventConsensus.participantsCount += 1;

            peerResuls.forEach(document => {
                eventConsensus.add(document, sender);
            });
        })

        if(timeOut === undefined) {
            return true;
        }

        return new Promise((resolve)=>{
            setTimeout(()=>{

                const results = eventConsensus.results();

                resolve({
                    count : results.length,
                    results : results
                })

            }, timeOut);
        });

    }

    dropPeer(id)
    {
        if(this.peer.connections[id] !== undefined) {
            this.peer.connections[id].dataChannel.close();

            delete this.peer.connections[id]
        }
    }

}




export default foxql