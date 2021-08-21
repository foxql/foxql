# Quick start

It is recommended to install npm.

```bash
npm install foxql
```

Example usage

```javascript
import { foxql } from 'foxql';
const client = new foxql();
client.open();
```

## Configuration

Change signaling server
```javascript
const client = new foxql();

client.peer.use('socketOptions', {
    host : 'foxql-signal.herokuapp.com',
    port : null,
    protocol : 'https'
});

```
