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
                min : 3,
                max : 80,
                required : true
            },
            content : {
                type : 'string',
                min : 7,
                max : 500,
                required : true
            },
            documentId : {
                createField : ['title', 'content']
            },
            entryKey : {
                createField : ['title']
            }   
        }
    },
    {
        collectionName : 'webPage',
        fields : [
            'title',
            'description',
            'domain',
            'url'
        ],
        ref : 'documentId',
        schema : {
            title : {
                type : 'string',
                min : 4,
                max : 70,
                required : true
            },
            description : {
                type : 'string',
                min : 7,
                max : 255,
                required : true
            },
            url : {
                type : 'string',
                min : 6,
                max : 175,
                required : true
            },
            domain : {
                type : 'string',
                min : 6,
                max : 35,
                required : true
            },
            documentId : {
                createField : ['url']
            },
            documentSubId : {
                createField : ['domain']
            }   
        }
    }
]