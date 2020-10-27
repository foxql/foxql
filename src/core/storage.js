const lz77 = require('./lz77.js');

const compressor = new lz77();

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
        return compressor.decompress(this.findStorage())
    }

    saveStorage(dump)
    {
        localStorage.setItem(this.storageName, 
            compressor.compress(dump)    
        );
    }
}