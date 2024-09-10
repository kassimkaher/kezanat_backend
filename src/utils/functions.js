"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kdp = kdp;
exports.convertArabicToEnglishNumbers = convertArabicToEnglishNumbers;
class Utils {
    constructor() {
    }
}
function kdp(text, color) {
    switch (color) {
        case 'c':
            console.log('\x1b[36m%s\x1b[0m', text);
            break;
        case 'r':
            console.log('\x1b[31m%s\x1b[0m', text);
            break;
        case 'g':
            console.log('\x1b[32m%s\x1b[0m', text);
            break;
        case 'y':
            console.log('\x1b[33m%s\x1b[0m', text);
            break;
        case 'b':
            console.log('\x1b[34m%s\x1b[0m', text);
            break;
        case 'm':
            console.log('\x1b[35m%s\x1b[0m', text);
            break;
        case 'w':
            console.log('\x1b[37m%s\x1b[0m', text);
        default:
            break;
    }
}
function convertArabicToEnglishNumbers(arabicNumber) {
    // Mapping of Arabic-Indic numerals to Western numerals
    const arabicToEnglishMap = {
        '٠': '0',
        '١': '1',
        '٢': '2',
        '٣': '3',
        '٤': '4',
        '٥': '5',
        '٦': '6',
        '٧': '7',
        '٨': '8',
        '٩': '9'
    };
    // Replace each Arabic numeral with its English counterpart
    return Number.parseInt(arabicNumber.replace(/[٠-٩]/g, (match) => arabicToEnglishMap[match]));
}
exports.default = Utils;
