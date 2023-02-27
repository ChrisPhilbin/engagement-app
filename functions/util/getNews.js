const axios = require("axios");
const { newsApiKey } = require("./config");

exports.getInterestUpdates = async (interests) => {
  if (!interests || interests.length === 0) {
    return null;
  }

  let today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0];

  let promisesUrl = [];

  interests.forEach((interest) => {
    promisesUrl.push(
      `http://newsapi.org/v2/everything?q=${interest}&from=${yesterday}&to=${yesterday}&sortBy=popularity&pageSize=1&apiKey=${newsApiKey}`
    );
  });

  let interestData = await Promise.all(
    promisesUrl.map(async (url) => {
      const response = axios.get(url);
      const responseData = await response;
      return responseData;
    })
  );

  return interestData.map((article) => {
    return article.data;
  });
};
