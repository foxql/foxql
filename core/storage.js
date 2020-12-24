class storage {

    constructor({name})
    {
        this.name = name;
    }

    get()
    {   
        return localStorage.getItem(this.name)
    }

    set(data)
    {
        return localStorage.setItem(this.name, data);
    }

}


export default storage