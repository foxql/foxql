const validator = require('../core/validator.js');

module.exports = (network) => {
    network.p2p.on("query-signal",(signal)=>{

        const validateQueryObject = new validator(network.networkDataModels.signal, signal);

        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};

        const query = signal.database;

        const process = network[query.method](query.params);

        network.p2p.emit(signal.listener, process, signal.peerId);

    });
}