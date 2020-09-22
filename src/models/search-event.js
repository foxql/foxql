module.exports = {
    query : {
        type : 'string',
        required : true,
        min : 1,
        max : 120
    },
    listener : {
        type : 'string',
        min : 3,
        max : 40,
        required : true
    }
}