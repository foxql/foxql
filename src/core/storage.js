const storageTemplate = require('../models/empty-storage.js')

module.exports = class {

    constructor(storageName)
    {
        this.name = storageName;
        
        const storage = this.findStorage()
        if(!storage) this.emptyStorage()
        if(storage) this.readStorage(storage)
    }


    findStorage()
    {
        return localStorage.getItem(this.name) || false
    }

    emptyStorage()
    {
        this.db = require('../models/empty-storage.js')
        this.saveStorage();
    }

    readStorage(storage)
    {
        this.db = JSON.parse(storage);
    }

    saveStorage()
    {
        const parseObject = JSON.stringify(this.db);
        localStorage.setItem(this.name, parseObject);
    }
}