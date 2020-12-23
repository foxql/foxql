import index from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"
import storage from "./core/storage.js";
import events from './events.js';


class foxql {

    indexOptions = {
        fields : [
            'title',
            'content'
        ],
        ref : 'documentId'
    }

    storageOptions = {
        name : 'foxql-storage',
        interval : 100 
    }

    useAvaliableObjects = [
        'serverOptions',
        'indexOptions',
        'storageOptions'
    ]

    indexs
    peer

    indexSaveStatus = false


    constructor(){
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
        this.indexs.addField(
            this.indexOptions.fields
        )
        this.indexs.setRef(
            this.indexOptions.ref
        )

        this.indexs.registerAnalyzer('tokenizer', (string)=>{
            return string.toLowerCase().replace(/  +/g, ' ').trim();
        }); 

        this.storage = new storage(
            this.storageOptions.name
        );

        delete this.indexOptions

        this.indexDatabaseLoop();

    }

    indexDatabaseLoop()
    {
        setInterval(()=>{
            if(this.indexSaveStatus){
                // todo dump db
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