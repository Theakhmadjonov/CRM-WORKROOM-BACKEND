"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otp_generator_1 = require("otp-generator");
const generateOtp = () => {
    const otp = (0, otp_generator_1.generate)(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    return otp;
};
exports.default = generateOtp;
//# sourceMappingURL=generate-otp.js.map