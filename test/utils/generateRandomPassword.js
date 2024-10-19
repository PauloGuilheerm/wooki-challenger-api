const generateRandomPassword = (length = 12) => {
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()-_=+[]{};:,.<>?';

    const allCharacters = upperCaseLetters + lowerCaseLetters + numbers + specialCharacters;

    const passwordArray = [
        upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
        lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialCharacters[Math.floor(Math.random() * specialCharacters.length)]
    ];

    for (let i = passwordArray.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        passwordArray.push(allCharacters[randomIndex]);
    }

    const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5).join('');

    return shuffledPassword;
};

module.exports = { generateRandomPassword }