const p2p = require('socket.io-p2p');
const io = require('socket.io-client');
const networkEnum = require("../enums/network.js");

const events = {
    message : require("../events/message.js")
};

module.exports = class extends require("./database.js"){

    constructor({storageName = "foxql-storage", ...rest}){
        super(storageName)
        this.options = rest;
        this.socket = null;
        this.p2p = null;

        this.clients = {};
    }

    /**
     * 
     * @param {*} params - network options object insert constructor object
     */
    readOptions(params)
    {
        if(params.numClients!==undefined){
            this.options.numClients = params.numClients;
        }

        if(params.autoUpgrade!==undefined){
            this.options.autoUpgrade = params.autoUpgrade;
        }

        if(params.host!==undefined){
            this.options.host = params.host;
        }

    }

    open(callback)
    {
        this.socket = io(this.options.host);
        this.p2p = new p2p(this.socket,this.options,()=>{
            console.log(networkEnum.P2P_CONNECTED);
            callback(true);
        });
    }

    loadEvents(eventList)
    {
        eventList.map(event=>{
            if(events[event]!==undefined){
                new events[event](this.p2p);
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



}