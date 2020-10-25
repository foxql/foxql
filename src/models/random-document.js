module.exports = {
    type : {
        required : true,
        in : ['entry', 'webpage']
    },
    listener : {
        type : 'string',
        min : 3,
        max : 40,
        required : true
    }
}