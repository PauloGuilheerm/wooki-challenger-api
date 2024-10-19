const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
  try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      return hashedPassword;
  } catch (error) {
      console.error("Erro ao criar o hash:", error);
      throw error;
  }
};

module.exports = { hashPassword }