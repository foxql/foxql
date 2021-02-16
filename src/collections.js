export default [
    {
        collectionName : 'entrys',
        fields : [
            'title',
            'content',
            'entryKey',
            'createDate'
        ],
        ref : 'documentId',
        schema : {
            title : {
                type : 'string',
                min : 4,
                max : 80,
                required : true
            },
            content : {
                type : 'string',
                min : 20,
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
    }
]