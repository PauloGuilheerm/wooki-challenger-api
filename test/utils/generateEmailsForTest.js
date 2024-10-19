const generateRandomEmail = () => {
  const domains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'example.com'
  ];

  function generateRandomString(length) {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
      }
      return result;
  }
  const username = generateRandomString(10);

  const randomDomain = domains[Math.floor(Math.random() * domains.length)];

  return `${username}@${randomDomain}`;
}

module.exports = { generateRandomEmail }