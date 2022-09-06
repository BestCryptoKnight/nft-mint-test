export const numberWithCommas = (x, decimal=0) => {
    if(!x) return "0"
    if(x > 100000000000) {
        return x.toExponential(4)    
    }
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
    
    if(parts[1] && decimal) {
        parts[1] = parts[1].slice(0, decimal);
    }
    if(Number(parts[1]) !== 0)
        return parts.join(".");
    else return parts[0]
}

export const converNumber2Str = (amount, decimals = 18) => {
    return '0x' + (Math.round(amount * Math.pow(10, decimals))).toString(16)
}