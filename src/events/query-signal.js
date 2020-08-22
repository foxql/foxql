const validator = require('../core/validator.js');

module.exports = (network) => {
    network.p2p.on("query-signal",(query)=>{
        
        const validateQueryObject = new validator(network.networkDataModels.signal, query);

        if(validateQueryObject.fail) return {status : false, error : validateQueryObject.fail};

        console.log(query);

    });
}