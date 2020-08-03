const enums = require('../enums/validator-enum.js');

module.exports = class {

    constructor(template, data)
    {
        this.fail = false;

        for(let parentKey in template)
        {
            const subTemplateObject = template[parentKey];
            const subObject = data[parentKey] ?? false;

            if(!subObject) {
                this.fail = enums.MISSING_PARENT_KEY;
            }
            
            if(typeof subTemplateObject == 'object'){
               
                for(let subKey in subTemplateObject)
                {
                    const requirements = subTemplateObject[subKey];
                    const compulsory = requirements.required;
                    const subData = subObject[subKey];
                    if(compulsory && subData == undefined) {
                        this.fail = enums.MISSING_KEY;
                    }else{

                        const type = requirements.type ?? false;

                        if(typeof subData != type){
                            this.fail = enums.DATA_TYPE;
                        }

                        const min = requirements.min ?? false;

                        const lenght = subData.length;

                        if(min && lenght < min){
                            this.fail = enums.VALUE_LENGHT;
                        }

                        const max = requirements.max ?? false;

                        if(max && lenght > max){
                            this.fail = enums.VALUE_LENGHT;
                        }

                    }

                    
                    
                }

            }
            
        }


        return this.fail;
    }

}