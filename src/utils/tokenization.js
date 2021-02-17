export default (string)=>{
    return string.toLowerCase().
    replace(/ö/gi, 'o').
    replace(/ç/gi, 'c').
    replace(/ş/gi, 's').
    replace(/ğ/gi, 'g').
    replace(/ü/gi, 'u').
    replace(/ı/gi, 'i').
    replace(/[^\w\s]/gi, ' ').
    replace(/  +/g, ' ').
    trim();
}