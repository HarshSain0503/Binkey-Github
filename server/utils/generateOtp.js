const generateOtp = () => {
    return Math.floor(Math.random() * 900000) + 100000; // Generates a number between 100000 and 999999
};

export default generateOtp;