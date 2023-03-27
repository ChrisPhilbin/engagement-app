"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterestUpdates = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const getInterestUpdates = async (interests) => {
    if (!interests || interests.length === 0) {
        return null;
    }
    let today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0];
    let promisesUrl = [];
    interests.forEach((interest) => {
        promisesUrl.push(`http://newsapi.org/v2/everything?q=${interest}&from=${yesterday}&to=${yesterday}&sortBy=popularity&pageSize=1&apiKey=${config_1.newsApiKey}`);
    });
    let interestData = await Promise.all(promisesUrl.map(async (url) => {
        const response = axios_1.default.get(url);
        const responseData = await response;
        return responseData;
    }));
    return interestData.map((article) => {
        return article.data;
    });
};
exports.getInterestUpdates = getInterestUpdates;
//# sourceMappingURL=getNews.js.map