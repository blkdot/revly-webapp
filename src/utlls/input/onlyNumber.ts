const onlyNumber = (event) => {
  const code = ['Backspace', 'Arrow'];

  const isValid = code.some((v) => event.code.includes(v)) || /^[0-9]*$/.test(event.key);
  if (!isValid) {
    event.preventDefault();
  }
};

export default onlyNumber;
