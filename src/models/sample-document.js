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
            max : 2200,
            required : true
        },
        documentType : {
            type : 'string',
            required : true,
            in : ['entry', 'webpage']
        },
        url : {
            type : 'string',
            max : 512,
            min : 0,
            useDocType : ['webpage']
        },
        domain : {
            type : 'string',
            max : 256,
            min : 0,
            useDocType : ['webpage']
        }
    }
}