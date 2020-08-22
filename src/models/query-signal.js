module.exports = {
    database : {
        method : {
            type : 'string',
            min : 5,
            max : 25,
            required : true
        },
        params : {
            required : true
        }
    },
    peerId : {  
        type : 'string',
        size : 20,
        required : true
    }
};