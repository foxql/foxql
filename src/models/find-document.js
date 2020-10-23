module.exports = {
    ref : {
        type : 'string',
        required : true,
        min : 1,
        max : 256
    },
    listener : {
        type : 'string',
        min : 3,
        max : 40,
        required : true
    }
}