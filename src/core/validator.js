const enums = require('../enums/validator-enum.js');

module.exports = class {

    constructor(model, data)
    {
        this.fail = false;

        for(let modelKey in model)
        {
            
            if(data[modelKey] == undefined) this.fail = enums.MISSING_PARENT_KEY;

            if(!this.fail){

                const requirements = model[modelKey];
                const dataArgs = data[modelKey];

                if(typeof dataArgs == 'object'){
                    for(let requirementsKey in requirements){
                        this.eachRequirements(requirements[requirementsKey], dataArgs[requirementsKey]);
                    }
                }else{
                    this.eachRequirements(requirements, dataArgs);
                }

            }
            
        }
    }

    eachRequirements(requirements, data)
    {
        for(let key in requirements){
            if(this[key]!==undefined && !this.fail) this[key](requirements[key], data);
        }
    }


    type(type, data)
    {
        this.fail = typeof data != type ? enums.DATA_TYPE : false;
    }
    min(min, data)
    {
        this.fail = (data.length < min) ? enums.VALUE_LENGHT : false;
    }
    max(max, data)
    {
        this.fail = (data.length > max) ? enums.VALUE_LENGHT : false;
    }
    size(size, data)
    {
        this.fail = (data.length !== size) ? enums.VALUE_LENGHT : false;
    }

}