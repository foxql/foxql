class storage {

    name;

    constructor(name)
    {
        this.name = name;
    }

    get()
    {
        return localStorage.getItem(this.name)
    }

    set(data)
    {
        return localStorage.setItem(this.name, JSON.stringify(data));
    }

}


export default storage