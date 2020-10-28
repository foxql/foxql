const validator = require('./validator.js');
const hash = require('hash.js');
const foxqlIndex = require('@foxql/foxql-index');
const databaseEnums = require('../enums/database-enum.js');
const tokenizator = require('./tokenization.js');

const models = {
    document : require('../models/sample-document.js')
};


module.exports = class extends require('./storage.js'){
    constructor({storageName, fields, ref, saveInterval, maxDocumentCount})
    {
        super(storageName)

        this.indexs = new foxqlIndex();

        this.indexs.addField(fields);
        this.indexs.setRef(ref);

        this.indexs.registerAnalyzer('tokenizer', (string)=>{
            return new tokenizator(string, ['lowerCase', 'turkishCharReplace', 'cleanString', 'removeSpaces', '_trim'], ' ').str;
        }); 

        const existDump = this.findStorage();
        if(existDump){
            this.indexs.import(this.readStorage());
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

                const jsonString = this.indexs.export();
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

        data.document.signature = hash.sha256().update(
            JSON.stringify(data.document)
        ).digest('hex');

        this.indexs.addDoc(data.document);

        if(this.indexs.getDoc(data.document.documentId)){
            this.maxDocumentLengthControl();
            this.dbStatus.waitingSave = true;
            return {status : true, message : databaseEnums.PROCESS_COMPLATED}
        }
        return {status : false, error : true}

    }

    maxDocumentLengthControl()
    {
        if(this.indexs.documentLength > this.maxDocumentCount){
            const targetDocumentRef = Object.keys(this.indexs.documents).shift();

            this.localRemoveDoc(targetDocumentRef);

        }
    }

    localRemoveDoc(ref)
    {
        const doc = this.indexs.getDoc(ref);
        if(!doc) return {status : false, error : databaseEnums.NOT_FOUND_DOCUMENT_BY_REF};

        this.indexs.deleteDoc(doc);

        if(this.indexs.getDoc(ref)) return {status : false, error : databaseEnums.PROCESS_NOT_COMPLATED};

        this.dbStatus.waitingSave = true;
        return {status : true}
    }

    randomDocument(type)
    {
        const documentStore = this.indexs.documents;
        const docKeys = Object.keys(documentStore);
        const filteredDocs = docKeys.reduce((r, ref)=>{
            if(documentStore[ref].documentType == type){
                r[ref] = documentStore[ref];
                return r;
            }
        }, {});

        const docs = Object.keys(filteredDocs);

        if(docs.length <= 0) {return false;}


        const key = Math.floor(Math.random() * docs.length);
        return filteredDocs[docs[key]];
    }

    stringNormalize(string)
    {
        return new tokenizator(string, ['lowerCase', 'turkishCharReplace', 'cleanString'],'').str;
    }
}