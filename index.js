import index from "@foxql/foxql-index"
import peer from "@foxql/foxql-peer"

class foxql {

    peerOptions = {}

    indexOptions = {
        fields : [
            'title',
            'content'
        ],
        ref : 'documentId'
    }

    useAvaliableObjects = [
        'peerOptions',
        'indexOptions'
    ]

    indexs
    peer


    constructor(){
        this.indexs = new index(); 
        this.peer = new peer();
    }

    use(name, values)
    {
        if(this.useAvaliableObjects.includes(name)){
            this[name] = {...this[name], ...values}
        }
    }

    open()
    {
        this.indexs.addField(
            this.indexOptions.fields
        )
        this.indexs.setRef(
            this.indexOptions.ref
        )

        delete this.indexOptions
        
    }

}




export default foxql