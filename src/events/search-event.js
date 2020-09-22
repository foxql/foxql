const model = require('../models/search-event.js');
const validator = require('../core/validator.js');
module.exports = ({network, ...event}) => {
    const data = event.data || {};
    const validate = new validator(model, data);
    if(validate.fail) return {status : false, error : validate.fail};

    const queryParams = data.params || false;

    let results = [];

    if(queryParams){
        results = network.localSearch(data.query, queryParams);
    }else{
        results = network.localSearch(data.query);
    }

    if(results.length <= 0) return;

    const answerObject = {
        eventType : data.listener,
        data : {
            results : results,
            answering : network.peerId
        }
    };

    network.emit(answerObject);

}