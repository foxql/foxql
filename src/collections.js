export default [
    {
        collectionName : 'entrys',
        fields : [
            'title',
            'content',
            'entryKey',
            'parentDocumentId',
            'createDate'
        ],
        ref : 'documentId',
        schema : {
            title : {
                type : 'string',
                min : 2,
                max : 80
            },
            content : {
                type : 'string',
                min : 1,
                max : 500
            },
            documentId : {
                createField : ['title', 'content', 'parentDocumentId']
            },
            entryKey : {
                createField : ['title']
            },
            createDate : {
                type : 'date'
            },
            parentDocumentId : {
                type : ['empty', 'string']
            }  
        }
    }
]