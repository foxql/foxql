import foxqlIndex from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"
import storage from "./utils/storage.js";
import events from './events.js';
import tokenization from './utils/tokenization.js';
import consensus from './utils/consensus.js';
import nativeCollections from './collections.js';


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
                
                /** TODO - DAHA SONRA BU ALAN KALDIRILACAK. */

                const jsonObject = JSON.parse(dump);
                for(let collectionName in jsonObject) {

                    if(this.currentCollections.includes(collectionName)) {
                        
                        const parseDumpDocuments = Object.values(JSON.parse(jsonObject[collectionName]).documents);

                        const targetCollection = this.database.useCollection(collectionName);

                        parseDumpDocuments.forEach(doc => {
                            doc.parentDocumentId = null;
                            targetCollection.addDoc(doc);
                        })

                    }

                }

                nativeCollections.forEach(collection => {
                    const collectionName = collection.collectionName;
                    this.database.useCollection(collectionName).registerAnalyzer('tokenizer', tokenization);
                })

                return true;
            }catch(e) // dedected new version database dump string.
            {
                this.database.import(
                    dump
                )

                nativeCollections.forEach(collection => {
                    const collectionName = collection.collectionName;
                    this.database.useCollection(collectionName).registerAnalyzer('tokenizer', tokenization);
                })

                return true;
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
                    this.storage.set(dump);
    
                    this.databaseSaveProcessing = false;
                    targetCollection.waitingSave = false;
                }  
            })
        }, this.storageOptions.interval);
    }


    listenEvents(list)
    {
        list.forEach( name => {
            const eventListener = events[name] || false;
            if(eventListener){
                this.peer.onPeer(eventListener.name, eventListener.listener.bind(this));
            }
        });     
    }

    pushEvent({name, listener})
    {
        this.peer.onPeer(name, listener.bind(this));
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

    async sendEvent(event, {peerListener, timeOut, documentPool})
    {
        timeOut += this.peer.simulatedListenerDestroyTime;
        const eventConsensus = new consensus();
        const eventListenerName = this.randomString();

        event.listener = eventListenerName;

        await this.peer.broadcast({
            listener : peerListener,
            data : event
        });

        if(Object.prototype.toString.call( documentPool ) === '[object Array]') {     
            documentPool.forEach(document => {
                eventConsensus.add(document, {
                    ...this.peer.peerInformation,
                    sender : this.peer.myPeerId
                });
            });
            eventConsensus.participantsCount += 1;
        }

        this.peer.onPeer(eventListenerName, async (data)=> {
            const peerResults = data.results || [];

            const sender = data._by || false;

            const senderPackage = {
                sender : data._by,
                ... data._peerInformation 
            };

            if( Object.prototype.toString.call( peerResults ) !== '[object Array]'){
                eventConsensus.add(peerResults, senderPackage);
                eventConsensus.participantsCount += 1;
                return;
            }

            if(peerResults.length <= 0 || !sender) {
                return;
            }
            eventConsensus.participantsCount += 1;

            peerResults.forEach(document => {
                eventConsensus.add(document, senderPackage);
            });
        })

        if(timeOut === undefined) {
            return true;
        }

        return new Promise((resolve)=>{
            setTimeout(()=>{
                delete this.peer.peerEvents[eventListenerName];

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