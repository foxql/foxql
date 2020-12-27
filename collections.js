export default [
    {
        collectionName : 'entrys',
        fields : [
            'title',
            'content'
        ],
        ref : 'documentId'
    },
    {
        collectionName : 'webPage',
        fields : [
            'title',
            'description',
            'keywords',
            'domain'
        ],
        ref : 'documentId'
    }
]