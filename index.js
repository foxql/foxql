import index from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"
import storage from "./core/storage.js";
import events from './events.js';


class foxql {
    constructor(){
        
        this.indexOptions = {
            fields : [
                'title',
                'content'
            ],
            ref : 'documentId'
        }
    
        this.storageOptions = {
            name : 'foxql-storage',
            interval : 100,
            saveInterval : false 
        }
    
        this.useAvaliableObjects = [
            'serverOptions',
            'indexOptions',
            'storageOptions'
        ]
    
        this.indexSaveProcessing = false

        this.indexs = new index(); 
        this.peer = new peer();
    }

    use(name, values)
    {
        if(this.useAvaliableObjects.includes(name)){
            this[name] = {...this[name], ...values}
        }
    }

    open()
    {

        const saveInterval = this.storageOptions.saveInterval || false;

        
        this.indexs.addField(
            this.indexOptions.fields
        )
        this.indexs.setRef(
            this.indexOptions.ref
        )

        if(saveInterval) {
            this.storage = new storage(
                this.storageOptions
            );

            this.loadDumpOnStorage();
        }

        this.indexs.registerAnalyzer('tokenizer', (string)=>{
            return string.toLowerCase().replace(/  +/g, ' ').trim();
        }); 

        delete this.indexOptions

        if(saveInterval) {
            this.indexDatabaseLoop();
        }

    }

    loadDumpOnStorage()
    {
        const dump = this.storage.get();
        if(dump && typeof dump === 'string') {
            try {
                this.indexs.import(
                    dump
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
            if(this.indexs.waitingSave && !this.indexSaveProcessing){
                this.indexSaveProcessing = true;

                const dump = this.indexs.export();
                this.storage.set(dump);

                this.indexSaveProcessing = false;
                this.indexs.waitingSave = false;
            }
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


    publishDocument(document){
        this.peer.broadcast({
            listener : 'onDocument',
            data : document
        });
    }   

    randomString()
    {
        return Math.random().toString(36).substring(0,30).replace(/\./gi, '');
    }

    search({query, timeOut}, callback)
    {
        let results = [];
        let resultsMap = {}

        const generatedListenerName = this.randomString()

        const body = {
            listener : generatedListenerName,
            query : query
        };

        this.peer.onPeer(generatedListenerName,async (data)=> {
            const peerResuls = data.results || [];
            if(peerResuls <= 0) return;

            peerResuls.forEach(document => {
                if(resultsMap[document.documentId] == undefined){
                    results.push(document);
                    resultsMap[document.documentId] = 1
                }
            })
        })


        this.peer.broadcast({
            listener : 'onSearch',
            data : body
        })

        setTimeout(() => {
                callback(results)
                delete this.peer.peerEvents['test-search']
        }, timeOut);
    }

}




export default foxql