const validator = require('./validator.js');
const hash = require('hash.js');
const elasticlunr = require('elasticlunr');
const databaseEnums = require('../enums/database-enum.js');

const models = {
    document : require('../models/sample-document.js')
};


module.exports = class extends require('./storage.js'){
    constructor({storageName, fields, ref, saveInterval, maxDocumentCount})
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

        this.maxDocumentCount = maxDocumentCount;
        this.refField = ref;

        this.dbStatus = {
            savingProcess : false,
            waitingSave : false
        };
    
        if(saveInterval !== undefined) this.saveLoop(storageName, saveInterval);
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

    refInDocument(data)
    {
        if(data.refInDocument !== undefined){
            return data.document[data.refInDocument];
        }

        return false;
    }


    pushData(data)
    {
        const control = new validator(models.document, data);
        if(control.fail){
            return {status : false, error : control.fail}
        }

        let refValue = this.stringNormalize(JSON.stringify(data.document));

        const inDocumentRef = this.refInDocument(data);
        if(inDocumentRef){
            refValue = this.stringNormalize(inDocumentRef);
        }



        data.document.documentId = hash.sha256().update(
            refValue
        ).digest('hex');

        this.indexs.addDoc(data.document);

        if(this.findByRef(data.document.documentId)){
            this.maxDocumentLengthControl();
            this.dbStatus.waitingSave = true;
            return {status : true, message : databaseEnums.PROCESS_COMPLATED}
        }
        return {status : false, error : true}

    }

    maxDocumentLengthControl()
    {
        if(this.indexs.documentStore.length > this.maxDocumentCount){
            const targetDocumentRef = Object.keys(this.indexs.documentStore.docs).shift();

            this.localRemoveDoc(targetDocumentRef);

        }
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
            let doc = this.findByRef(ref.ref);
            doc.score = ref.score;
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