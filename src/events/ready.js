module.exports  = class {
    constructor(p2p)
    {
        p2p.on('ready', ()=>{
            p2p.usePeerConnection = true;
        });
    }
}