import hash from 'hash.js'

class consensus {

    constructor()
    {   
        this.hashMap = {}
        this.participantsCount = 0;

        this.uniqueDocumentCount = 0
        this.requirementMinFrequency = 0.8;
        this.requirementMinParticipantsByDocument = 0.6;
        this.percentParticipants = 0;
    }

    add(document, senderPackage)
    {
        const senderId = senderPackage.sender;
        const key = this.makeKey(document)
    
        if(this.check(key)){
            this.hashMap[key] = {
                doc : document,
                count : 1,
                genesisRecieveTime : new Date(),
                recievePoolingTime : 0,
                senderCount : 1,
                senderMap : {}
            }

            this.hashMap[key].senderMap[senderId] = senderPackage;

            this.uniqueDocumentCount ++
            return true
        }

        this.up(key, senderId)
    }


    up(key, sender)
    {
        let target = this.hashMap[key];
        target.count+=1
        const time = new Date();
        target.recievePoolingTime = time.getTime() - target.genesisRecieveTime.getTime()

        if(target.senderMap[sender] === undefined) {
            target.senderMap[sender] = 1;
            target.senderCount++;
        }else{
            target.senderMap[sender] ++;
        }

    }


    check(key)
    {
        return this.hashMap[key] === undefined
    }

    makeKey(document)
    {
        return hash.sha256().update(JSON.stringify(document)).digest('hex')
    }

    calculateDifficulty(item)
    {
        const senderCount = item.senderCount;
        const participantsScore = senderCount * this.requirementMinParticipantsByDocument;

        if(this.percentParticipants > participantsScore) {
            return false;
        }

        const actualVotingFrequency = senderCount / item.count;

        if(actualVotingFrequency < this.requirementMinFrequency) {
            return false
        }

        return true;
    }

    results()
    {
        this.percentParticipants = this.requirementMinParticipantsByDocument;
        return Object.values(this.hashMap).filter((item)=>{

            return this.calculateDifficulty(item);

        });     

    }

}



export default consensus;