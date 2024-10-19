const generateRandomName = () => {
  const firstNames = [
    "John", "Maria", "Carlos", "Anna", "Lucas", "Fernanda",
    "Richard", "Camila", "Gabriel", "Juliana"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown",
    "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez"
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};

module.exports = { generateRandomName }
