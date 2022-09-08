const pattern = {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phoneNumber: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    number: /^[0-9]*$/,
    alphabet: /^[A-Za-z]+$/i
};

const validator = {
    length : (val) => val.length >= 2,
    isEmail: (val) => pattern.email.test(val),
    isPhone: (val) => pattern.phoneNumber.test(val),
    isNumber: (val) => pattern.number.test(val),
    isAlphabet: (val) => val.length >= 2 && pattern.alphabet.test(val)
};

export default validator;