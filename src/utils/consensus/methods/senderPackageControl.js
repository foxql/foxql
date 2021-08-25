const requirementFields = [
    'alias',
    'avatar',
    'explanation',
    'sender'
];

function fieldCheck(obj)
{   
    for(let key in obj) {

        const value = obj[key];

        if(!requirementFields.includes(key)){
            return false;
        }

        const dataType = typeof(value);

        if( !( dataType === 'string' || value === null ) ){
            return false;
        }

        if(dataType === 'string' && value.length > 125) {
            return false;
        }

    }

    return true;
}

function requirementFieldControl(obj)
{
    const objectKeys = Object.keys(obj);

    for(let index in requirementFields) {
        const field = requirementFields[index];
        if(!objectKeys.includes(field)){
            return false;
        }
    }   

    return true;

}

export default function(obj)
{   
    if(typeof obj !== 'object') {
        return false;
    }

    if(!fieldCheck(obj) || !requirementFieldControl(obj)) {
        return false;
    }

    return true;
}