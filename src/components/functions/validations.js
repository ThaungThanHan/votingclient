export const isEqual = (value1,value2) => {
    if(value1 == value2){
        return true;
    }else{
        return false;
    }
}
export const isValidPassword = (value1) => {
    const length = value1.length;
    if(length < 8) {
        return false;
    }else{
        return true;
    }
}
export const isEmail = (value1) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

    return regex.test(value1)
}