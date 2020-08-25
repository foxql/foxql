module.exports = class {

    constructor(socket)
    {
        this.events = {};
        
        socket.addListener('message', message=>{
            if(message.type != undefined && message.data!= undefined)
            {
                this.emit(message.type, message.data);
            }
        });

    }


    on(name, listener)
    {
        if(this.events[name] == undefined) this.events[name] = [];
        this.events[name].push(listener);
    }

    emit(name, data)
    {
        if(this.events[name] == undefined) return false;

        const callback = (callback) => {
            callback(data);
        };

        this.events[name].forEach(callback);
    }

}