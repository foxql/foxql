import Peer from 'peerjs';

const networkEnum = require("../enums/network-enum.js");
const validator = require('./validator.js');
const socketListener = require('./socket-listener.js');
const events = {
    querySignal : require('../events/query-signal.js')
};

module.exports = class extends require("./database.js"){

    constructor({database, ...options}){
        super(database)
        this.options = options;

        this.peerId = this.randomPeerId();

        this.peer = new Peer(this.peerId, options);
        this.socket = new socketListener(this.peer.socket);

        this.socket.on('offerList',this.offerList.bind(this));

        this.networkDataModels = {
            signal : require('../models/query-signal.js')
        };

        this._events = {};
    }

    offerData(event)
    {
        if(typeof event !== 'object') return false;
        if(event.type == undefined || event.data == undefined) return false;

        this.emit(event.type, event.data);
    }

    offerClose(id)
    {
        this.emit('offer-close', id);
    }

    /**
     * @param {*} offers - new connected user list.
     */
    offerList(offers)
    {
        offers.map( offer => {
                const conn = this.peer.connect(offer);
                const id = conn.peer;
                conn.on('data', this.offerData.bind(this))
                conn.on('close', this.offerClose.bind(this, id));
        });
    }

    on(name, listener)
    {
        if(this._events[name] == undefined) this._events[name] = [];
        this._events[name].push(listener);
    }

    emit(name, data)
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
                events[event](this);
            }
        });
    }


    push(data)
    {

        if(data.data!==undefined){
            data.data.event = data.listener;
        }

        this.p2p.emit(data.listener, data.data);
    }


    querySignal(query)
    {   
        query.peerId = this.p2p.peerId;
        const validateQueryObject = new validator(this.networkDataModels.signal, query);

        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};
        this.p2p.emit(networkEnum.QUERY_SIGNAL, query);
        return {status : true};
    }   


    randomPeerId()
    {
        return 'fox_' + Math.random().toString(36).substr(2, 16);
    }


}