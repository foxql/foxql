const model = require('../models/sample-document.js');
const validator = require('../core/validator.js');
module.exports = ({network, ...event}) => {
    const data = event.data || {};
    const validate = new validator(model, data);
    if(validate.fail) return {status : false, error : validate.fail};

    network.pushData(data);
}