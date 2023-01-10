const bcrypt = require('bcrypt');

const hashPassword = (userPassword) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(userPassword, salt);
  return hash;
};

const comparePassword = (userPassword, hashedPassword) => bcrypt.compareSync(userPassword, hashedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
