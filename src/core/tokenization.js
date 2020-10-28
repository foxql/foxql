module.exports = class {
    constructor(string, methods, seperator)
    {
        this.seperator = seperator || '';
        this.str = string;

        methods.forEach(name => {
            const method = this[name] || false;
            if(typeof method == 'function') {
                this[name]();
            }
        });
    }

    turkishCharReplace()
    {
        this.str = this.str
        .replace(/ğ/gi,'g')
        .replace(/ü/gi,'u')
        .replace(/ş/gi,'s')
        .replace(/ı/gi,'i')
        .replace(/ö/gi,'o')
        .replace(/ç/gi,'c')
        .replace(/ /gi,'-');
    }

    lowerCase()
    {
        this.str = this.str.toLowerCase().trim();
    }

    cleanString()
    {
        this.str = this.str.replace(/[^a-z0-9]/gi,this.seperator);
    }

    removeSpaces()
    {
        this.str = this.str.replace(/\s\s+/g, '');
    }

    _trim()
    {
        this.str = this.str.trim();
    }


    
}
