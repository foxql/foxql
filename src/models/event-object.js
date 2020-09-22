module.exports = {
    eventType : {
        type : 'string',
        min : 3,
        max : 40,
        required : true
    },
    data : {
        type : 'object',
        required : true
    },
    peerId : {  
        type : 'string',
        min : 13,
        max: 20,
        required : true
    }
};