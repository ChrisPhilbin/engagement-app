import axios from "axios";
import { INews } from "../api/models/news-model";
import { newsApiKey } from "./config";

export const getInterestUpdates = async (interests: string[]): Promise<INews[] | null> => {
  if (!interests || interests.length === 0) {
    return null;
  }

  let today: Date = new Date();
  const yesterday: string = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0];

  let promisesUrl: string[] = [];

  interests.forEach((interest) => {
    promisesUrl.push(
      `http://newsapi.org/v2/everything?q=${interest}&from=${yesterday}&to=${yesterday}&sortBy=popularity&pageSize=1&apiKey=${newsApiKey}`
    );
  });

  let interestData = await Promise.all(
    promisesUrl.map(async (url) => {
      const response = axios.get<INews>(url);
      const responseData = await response;
      return responseData;
    })
  );

  return interestData.map((article) => {
    return article.data;
  });
};
