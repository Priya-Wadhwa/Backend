exports.validateContent = (arr) => {
  let validation = '';
  const str = 'is Required. ';

  arr.forEach((el) => !req.body[el] && (validation += el + ' ' + str));
  return validation;
};
