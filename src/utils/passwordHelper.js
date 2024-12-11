const becrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  const salt = await becrypt.genSalt(10);
  const hash = await becrypt.hash(password, salt);
  return hash;
};

exports.isPassMatched = async (password, hashedPassword) => {
  console.log('Received password:', password);
  console.log('Stored hashed password:', hashedPassword);

  try {
    const isMatch = await becrypt.compare(password, hashedPassword);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    return false;
  }
};