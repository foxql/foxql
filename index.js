import foxqlIndex from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"
import storage from "./core/storage.js";
import events from './events.js';

import nativeCollections from './collections.js';


class foxql {
    constructor(){
    
        this.storageOptions = {
            name : 'foxql-storage',
            interval : 100,
            saveInterval : false 
        }

        this.currentCollections = [];
    
        this.useAvaliableObjects = [
            'serverOptions',
            'storageOptions'
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

            this.database.useCollection(collectionName).registerAnalyzer('tokenizer', (string)=>{
                return string.toLowerCase().replace(/[^\w\s]/gi, ' ').replace(/  +/g, ' ').trim();
            });
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

    }

    loadDumpOnStorage()
    {
        const dump = this.storage.get();
        if(dump && typeof dump === 'string') {
            try {
                this.database.import(
                    JSON.parse(dump)
                );
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


    publishDocument(document, collection)
    {
        if(typeof collection !== 'string') return false;
        if(!this.currentCollections.includes(collection)) return false;

        this.peer.broadcast({
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

    search({query, timeOut, collections}, callback)
    {
        let tempResult = {};
        let documentMap = {}

        if(collections == undefined) {
            collections = this.currentCollections;
        }

        const generatedListenerName = this.randomString()

        const body = {
            listener : generatedListenerName,
            query : query,
            collections : collections
        };

        this.peer.onPeer(generatedListenerName,async (data)=> {
            const peerResuls = data.results;

            for(let collection in peerResuls) {
                if(tempResult[collection] === undefined) {
                    tempResult[collection] = [];
                }

                const documents = peerResuls[collection];


                documents.forEach( document => {
                    if(documentMap[document.document.documentId] == undefined){
                        tempResult[collection].push(document);
                        documentMap[document.document.documentId] = 1
                    }
                })
                
            }
        })


        this.peer.broadcast({
            listener : 'onSearch',
            data : body
        })

        setTimeout(() => {

            for(let collection in tempResult) {
                let documents = tempResult[collection];

                documents.sort((a,b)=>{
                    return b.score - a.score;
                });
            }

            callback(tempResult)
            delete this.peer.peerEvents[generatedListenerName]
        }, timeOut);
    }

}




export default foxql