const enums = require('../enums/validator-enum.js');

const exclusions = [
    'useDocType'
];

module.exports = class {

    constructor(model, data)
    {
        this.fail = false;
        this.object = data;
        for(let modelKey in model)
        {
            
            if(data[modelKey] == undefined) this.fail = enums.MISSING_PARENT_KEY;

            if(!this.fail){

                const requirements = model[modelKey];
                const dataArgs = data[modelKey];

                if(typeof dataArgs == 'object'){
                    for(let requirementsKey in requirements){
                        const requirement = requirements[requirementsKey];
                        if(dataArgs[requirementsKey] === undefined && requirement.required ){
                            this.fail = enums.MISSING_KEY;
                        }else if(dataArgs[requirementsKey] !== undefined){
                            this.eachRequirements(requirement, dataArgs[requirementsKey]);
                        }
                        
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
        this.fail = typeof data != type ? enums.DATA_TYPE+ ''+data : false;
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
    types(types, data)
    {
        types.forEach(type => this.fail = typeof data != type ? enums.DATA_TYPE : false);
    }
    in(values, data)
    {
        this.fail = (values.indexOf(data)<0) ? enums.NOT_FOUND_IN_ARRAY : false;
    }
    useDocType(types)
    {
        this.fail = (types.indexOf(this.object.document.documentType)<0) ? enums.NOT_FOUND_IN_ARRAY : false;
    }

}