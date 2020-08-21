const validator = require('./validator.js');
const hash = require('hash.js');
const elasticlunr = require('elasticlunr');
const validatorEnums = require('../enums/validator-enum.js');
const databaseEnums = require('../enums/database-enum.js');

const models = {
    entry : require('../models/entry-document.js')
};


module.exports = class extends require('./storage.js'){
    constructor({storageName, fields, ref, saveInterval})
    {
        super(storageName)

        const existDump = this.findStorage();
        if(existDump){
            this.indexs = elasticlunr.Index.load(
                this.readStorage()
            );

        }else{
            this.indexs = elasticlunr(function () {
                fields.map( field => this.addField(field));
                this.setRef(ref);
            });
        }

        this.dbStatus = {
            savingProcess : false,
            waitingSave : false
        };
    
        if(saveInterval !== undefined){
            this.saveLoop(storageName, saveInterval);
        }
    }

    saveLoop(interval)
    {
        setInterval( ()=>{
            const currentStatus = this.dbStatus;
            if(!currentStatus.savingProcess && this.indexs != undefined && currentStatus.waitingSave){
                this.dbStatus.savingProcess = true;

                const jsonString = this.indexs.toJSON();
                this.saveStorage(jsonString);
                this.dbStatus.waitingSave = false;
                this.dbStatus.savingProcess = false;
            }

        }, interval);
    }


    pushData(data)
    {
        const currentModel = models[data.document.documentType] ?? false;

        if(!currentModel) return {status : false, error : validatorEnums.MISSING_SAMPLE_MODEL}

        const control = new validator(currentModel, data);
        if(control.fail){
            return {status : false, error : control.fail}
        }

        let normalizeRefValue;

        if(data.refInDocument !== undefined){
            normalizeRefValue = data.document[data.refInDocument];
        }

        data.document.documentId = hash.sha256().update(
            this.stringNormalize(normalizeRefValue)
        ).digest('hex');

        this.indexs.addDoc(data.document);

        if(this.findByRef(data.document.documentId)){
            this.dbStatus.waitingSave = true;
            return {status : true, message : databaseEnums.PROCESS_COMPLATED}
        }
        return {status : false, error : true}

    }

    findByRef(ref)
    {
        return this.indexs.documentStore.docs[ref] || false;
    }   

    localSearch(params)
    {
        let refs = this.indexs.search(params);
        
        let docs = [];
        refs.map( ref => {
            const doc = this.findByRef(ref.ref);
            if(doc) return docs.push(doc);
        })

        return docs;
    }

    localRemoveDoc(ref)
    {
        const doc = this.findByRef(ref);
        if(!doc) return {status : false, error : databaseEnums.NOT_FOUND_DOCUMENT_BY_REF};
        
        this.indexs.removeDoc(doc);

        if(this.indexs.documentStore.hasDoc(ref)) return {status : false, error : databaseEnums.PROCESS_NOT_COMPLATED};

        this.dbStatus.waitingSave = true;
        return {status : true}

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