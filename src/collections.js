export default [
    {
        collectionName : 'entrys',
        fields : [
            'title',
            'content',
            'entryKey'
        ],
        ref : 'documentId',
        schema : {
            title : {
                type : 'string',
                min : 2,
                max : 80,
                required : true
            },
            content : {
                type : 'string',
                min : 1,
                max : 500,
                required : true
            },
            documentId : {
                createField : ['title', 'content']
            },
            entryKey : {
                createField : ['title']
            },
            createDate : {
                type : 'date',
                required : true
            }   
        }
    },
    {
        collectionName : 'comments',
        fields : [
            'documentId',
            'content',
            'createDate'
        ],
        ref : 'commentId',
        schema : {
            documentId : {
                type : 'string',
                required : true
            },
            content : {
                type : 'string',
                required : true,
                min : 3,
                max : 255
            },
            createDate : {
                type : 'date',
                required : true
            }   
        }
    }
]