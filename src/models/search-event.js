module.exports = {
    params : {
        required : true,
        types : ['object', 'string']
    },
    listener : {
        type : 'string',
        min : 3,
        max : 20,
        required : true
    }
}