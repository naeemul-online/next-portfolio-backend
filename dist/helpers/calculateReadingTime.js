"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateReadingTime = void 0;
const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};
exports.calculateReadingTime = calculateReadingTime;
