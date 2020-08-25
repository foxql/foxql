const validator = require('../core/validator.js');
const Peer = require('simple-peer');
const defaultPeerOptions = {
    allowHalfOpen: false,
    highWaterMark: 1048576,
    initiator: true
};

module.exports = (network) => {
    network.on("query-signal",(signal)=>{
        const validateQueryObject = new validator(network.networkDataModels.signal, signal);

        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};

        const fromPeerId = signal.peerId;

        const query = signal.database;

        const process = network[query.method](query.params);

        network.p2p.emit(signal.listener, process, fromPeerId);

    });
}