class middleware {
    constructor({timeout, warningLimit})
    {
        this.timeout = timeout;
        this.warningLimit = warningLimit;
        this.map = {};
    }

    up(id)
    {
        if(this.map[id] === undefined) {

            this.map[id] = {
                warning : false,
                count : 1
            };

            this.dropId(id);

        }else{
            this.map[id].count ++;
        }
    }

    status(id)
    {
        let target = this.map[id];

        if(target.count > this.warningLimit) {
            target.warning = true;
        }

        return target;

    }

    dropId(id)
    {
        setTimeout(()=>{
            delete this.map[id];
        }, this.timeout);
    }




}

export default middleware