import hash from 'hash.js'
import {
    senderPackageControl
} from './methods'

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

        const controlSender = senderPackageControl(senderPackage);
        if(!controlSender) {
            return false;
        }

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

            this.pushSender(key, senderPackage)

            this.uniqueDocumentCount ++

            return true
        }

        this.pushSender(key, senderPackage)

        this.up(key, senderId)
    }

    pushSender(key, senderPackage)
    {
        const senderId = senderPackage.sender;
        if(this.hashMap[key].senderMap[senderId] === undefined) {
            this.hashMap[key].senderMap[senderId] = {
                information : senderPackage,
                recieveCount : 1
            };
            return true;
        }

        this.hashMap[key].senderMap[senderId].recieveCount++;

    }


    up(key, sender)
    {
        let target = this.hashMap[key];
        target.count+=1
        const time = new Date();
        target.recievePoolingTime = time.getTime() - target.genesisRecieveTime.getTime()
        target.senderCount++;

    }


    check(key)
    {
        return this.hashMap[key] == undefined
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