const model = require('../models/find-document.js');
const validator = require('../core/validator.js');
module.exports = ({network, ...event}) => {
    const data = event.data || {};
    const validate = new validator(model, data);
    if(validate.fail) return {status : false, error : validate.fail}
    
    const document = network.findByRef(data.ref);

    if(!document){
        return false;
    }

    const answerObject = {
        eventType : data.listener,
        data : {
            results : document,
            answering : network.peerId
        }
    };

    network.emit(answerObject);

    //network.pushData(data);
}