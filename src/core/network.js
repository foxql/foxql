import Peer from 'peerjs';

const validator = require('./validator.js');
const socketListener = require('./socket-listener.js');

const events = {
    searchEvent : require('../events/search-event.js'),
    publishEvent : require('../events/publish-document.js'),
    findEntryEvent : require('../events/find-document.js')
};

const defaultDatabaseConfig  = {
    storageName : "foxql-database",
    saveInterval : 500,
    fields : [
        'title',
        'content',
        'documentType',
        'url',
        'domain'
    ],
    ref : 'documentId',
    maxDocumentCount : 1000
};

const networkHost = 'localhost';
const networkPort = 1923;
const networkApiPath = '/fox';

const defaultMaxPeers = 5;

module.exports = class extends require("./database.js"){

    constructor({database, ...options}){

        options.host = options.host || networkHost;
        options.port = options.port || networkPort;
        options.path = options.path || networkApiPath;

        options.maxPeers = (options.maxPeers==undefined) ? defaultMaxPeers : options.maxPeers; 

        if(database == undefined){
            database = defaultDatabaseConfig;
        }

        super(database)
        this.options = options;

        this.peerId = this.randomPeerId();

        this.peer = new Peer(this.peerId, options);

        this.peer.on('connection', conn => {
            conn.on('data', this.offerEvent.bind(this))
        });

        this.socket = new socketListener(this.peer.socket);

        this.socket.on('offerList',this.offerList.bind(this));


        this.networkDataModels = {
            eventObject : require('../models/event-object.js')
        };

        this._events = {};
    }

    offerEvent(event)
    {
        if(typeof event !== 'object') return false;
        const validateQueryObject = new validator(this.networkDataModels.eventObject, event);

        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};

        if(events[event.eventType]!=undefined){
           event.network = this; 
        }

        this._emit(event.eventType, event);
    }

    offerClose(id)
    {
        this._emit('offer-close', id);
    }

    /**
     * @method offerList listen new connections and setup offer connection.
     */
    offerList(offers)
    {
        offers.map( offer => {
                const conn = this.peer.connect(offer);
                const id = conn.peer;
                conn.on('data', this.offerEvent.bind(this))
                conn.on('close', this.offerClose.bind(this, id));
        });
    }

    on(params, listener, droppedEvent)
    {
        let name = null;
        if(typeof params == 'object'){

            if(params.name === undefined) return false;

            name = params.name;

            const listenerDropTime = params.listenerDropTime || false;

            if(listenerDropTime){
                setTimeout(()=>{
                    delete this._events[name];
                    droppedEvent(true);
                }, listenerDropTime);
            }

        }else if(typeof params == 'string'){
            name = params;
        }

        if(this._events[name] == undefined) this._events[name] = [];
        this._events[name].push(listener);
    }

    _emit(name, data)
    {
        if(this._events[name] == undefined) return false;

        const callbackMethod = (callback) => {
            callback(data);
        };

        this._events[name].forEach(callbackMethod);
    }

    loadEvents(eventList)
    {
        eventList.map(event=>{
            if(events[event]!==undefined){
                this.on(event, events[event]);
            }
        });
    }

    /**
     * @method broadcastEmit - send data all connected peer.
     */
    broadcastEmit(data)
    {
        data.peerId = this.peerId;
        const validateQueryObject = new validator(this.networkDataModels.eventObject, data);
        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};
        this.peer._connections.forEach(connections=>{
            connections.forEach(con => con.send(data));
        });
    }

    /**
     * @method emit - send data spesific peer.
     */
    emit(data, offerId)
    {
        data.peerId = this.peerId;
        const validateQueryObject = new validator(this.networkDataModels.eventObject, data);
        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};

        this.peer._connections.forEach(connections=>{
            connections.forEach(conn => {
                if(conn.peerId == offerId){
                    
                    conn.send(data);
                }
            });
        });
    }




    randomPeerId()
    {
        return 'fox_' + Math.random().toString(36).substr(2, 16);
    }


}