module.exports  = (network) => {
    network.p2p.on('ready', ()=>{
        network.p2p.usePeerConnection = true;
    });
}