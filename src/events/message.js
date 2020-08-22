module.exports = (network)=>{
    network.p2p.on("message",(data)=>{
        console.log(data);
    });
}