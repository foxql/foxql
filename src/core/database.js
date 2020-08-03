const validator = require('./validator.js');
const hash = require('hash.js');

const models = {
    document : require('../models/sample-document.js')
};


module.exports = class extends require('./storage.js'){
    constructor(storageName)
    {
        super(storageName)
    }

    pushData({type, ...data})
    {   
        if(type == undefined) return false

        const currentModel = models[type];
        if(currentModel == undefined) return false

        const control = new validator(currentModel, data);

        if(control.fail) return false;

        const primaryKeyMap = data.primaryKeyMap ?? false;

        if(!primaryKeyMap) return false;

        let trackingKey = data;
        primaryKeyMap.map(key => {
            if(trackingKey[key]!=undefined){
                trackingKey = trackingKey[key];
            }
        });
        
        const normalizeKey = this.stringNormalize(trackingKey);

        const documentId = hash.sha256().update(normalizeKey).digest('hex');
        
        if(!this.findById(documentId))
        {
            this.db.Documents[documentId] = data;
            this.updateDocumentCount();
            this.saveStorage();
        }

    }

    updateDocumentCount()
    {
        this.db.Informations.documentCount +=1;
    }

    findById(id)
    {
        if(this.db.Documents[id] != undefined) return true;
        else return false;
    }

    stringNormalize(string)
    {
        return string.toLowerCase().trim().
        replace(/^[a-z0-9]+$/i,'')
        .replace(/ğ/gi,'g')
        .replace(/ü/gi,'u')
        .replace(/ş/gi,'s')
        .replace(/ı/gi,'i')
        .replace(/ö/gi,'o')
        .replace(/ç/gi,'c')
        .replace(/ /gi,'-');
    }
}