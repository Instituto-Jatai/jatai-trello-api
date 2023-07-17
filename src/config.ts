import { allowedOrigins } from "./constants";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const config = {
  port,

  apiUrl: process.env.API_URL,

  env: process.env.NODE_ENV || "production",

  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : allowedOrigins,

  sendgrid: {
    key: process.env.SENDGRID_KEY,
    sender: process.env.SENDGRID_SENDER,
    url: process.env.SENDGRID_URL,
  },

  trello: {
    apiUrl: process.env.TRELLO_API_URL,
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN,
  },
};

export default config;
