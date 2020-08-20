const storageTemplate = require('../models/empty-storage.js')

module.exports = class {

    constructor(storageName) {
        this.storageName = storageName;
    }


    findStorage()
    {
        return localStorage.getItem(this.storageName) || false
    }


    readStorage()
    {
        return JSON.parse(
            this.findStorage()
        );
    }

    saveStorage(dump)
    {
        localStorage.setItem(this.storageName, 
            JSON.stringify(dump)    
        );
    }
}