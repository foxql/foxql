module.exports = class {
    constructor(p2p)
    {
        p2p.on("message",(data)=>{
            console.log(data);
        });
    }
}