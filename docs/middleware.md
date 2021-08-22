Create a new middleware instance
```javascript
import { middleware } from "foxql";

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 3
});

```

Push a new sender
```javascript
eventMiddleware.up(sender);
```

Control sender status in event listener
```javascript
const status = eventMiddleware.status(sender);

if(status.warning){
    /** Spam dedected **/
    return false;
}
```

Example
```javascript
import { middleware } from "foxql";

const eventMiddleware = new middleware({
    timeout : 1000, // miliseconds
    warningLimit : 3
});

const eventListenerName = 'helloWorld';

async function listener(data)
{ 
    const sender = data._by; // emitter peer id
    const simulateStatus = data._simulated;

    if(simulateStatus) { // checking data for webRTC connection
        return true;
    }

    eventMiddleware.up(sender);

    const access = eventMiddleware.status(sender);

    if(access.warning){
        if(this.peer.connections[sender] !== undefined) {
            this.dropPeer(sender);
        }
        return false;
    }

    this.peer.send(by, {
        listener : data.listener, // emitter waiting. Answer this listener name
        data :{
            message : "Hello!",
        }
    });
}

export default {
    name : eventListenerName,
    listener : listener
}
```