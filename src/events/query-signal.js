module.exports = ({network, ...query}) => {
    
    const offerId = query.peerId;
    const databaseQuery = query.database;
    const dbMethod = databaseQuery.method;
    const dbParams = databaseQuery.params;
    
    network.peer._connections.forEach(connections => {
        connections.forEach(conn => {
            if(conn.peer == offerId){
                conn.send({
                    type : query.listener,
                    data : {
                        answering : network.peerId,
                        results : network[dbMethod](dbParams)
                    }
                });
            }
        });
    });

}