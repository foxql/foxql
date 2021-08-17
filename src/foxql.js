import peer from "@foxql/foxql-peer";
import consensus from './utils/consensus';


class foxql {
    constructor(){

        this.databaseInstance = null;
        this.peer = new peer();

    }

    use(name, values)
    {
        if(this.useAvaliableObjects.includes(name)){
            this[name] = {...this[name], ...values}
        }
    }

    open()
    {
        this.peer.open();
    }

    pushEvent({name, listener})
    {
        this.peer.onPeer(name, listener.bind(this));
    }

    randomString()
    {
        return Math.random().toString(36).substring(0,30).replace(/\./gi, '');
    }

    async sendEvent(event, {peerListener, timeOut, documentPool})
    {
        timeOut += this.peer.simulatedListenerDestroyTime;
        const eventConsensus = new consensus();
        const eventListenerName = this.randomString();

        event.listener = eventListenerName;

        await this.peer.broadcast({
            listener : peerListener,
            data : event
        });

        if(Object.prototype.toString.call( documentPool ) === '[object Array]') {     
            documentPool.forEach(document => {
                eventConsensus.add(document, {
                    ...this.peer.peerInformation,
                    sender : this.peer.myPeerId
                });
            });
            eventConsensus.participantsCount += 1;
        }

        this.peer.onPeer(eventListenerName, async (data)=> {
            const peerResults = data.results || [];

            const sender = data._by || false;

            const senderPackage = {
                sender : data._by,
                ... data._peerInformation 
            };

            if( Object.prototype.toString.call( peerResults ) !== '[object Array]'){
                eventConsensus.add(peerResults, senderPackage);
                eventConsensus.participantsCount += 1;
                return;
            }

            if(peerResults.length <= 0 || !sender) {
                return;
            }
            eventConsensus.participantsCount += 1;

            peerResults.forEach(document => {
                eventConsensus.add(document, senderPackage);
            });
        })

        if(timeOut === undefined) {
            return true;
        }

        return new Promise((resolve)=>{
            setTimeout(()=>{
                delete this.peer.peerEvents[eventListenerName];

                const results = eventConsensus.results();

                resolve({
                    count : results.length,
                    results : results
                })

            }, timeOut);
        });

    }

    dropPeer(id)
    {
        if(this.peer.connections[id] !== undefined) {
            this.peer.connections[id].dataChannel.close();

            delete this.peer.connections[id]
        }
    }

}




export default foxql