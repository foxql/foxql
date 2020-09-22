module.exports = {
    document : {
        title : {
            type : 'string',
            min : 3,
            max : 120,
            required : true
        },
        content : {
            type : 'string',
            min : 10,
            max : 1500,
            required : true
        },
        documentType : {
            type : 'string',
            min : 3,
            max : 20,
            required : true
        }
    },
    refInDocument : {
        type : 'string',
        min : 3,
        max : 20,
        required : true
    }
}