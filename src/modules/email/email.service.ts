import axios from "axios";
import config from "../../config";

export type TagReplacers = {
  [key: string]: string;
};

export const EmailService = {
  messageFormatter: (message: string, replacers: TagReplacers): string => {
    let formattedMessage = message;
    Object.keys(replacers).forEach((param) => {
      const result = replacers[param];

      formattedMessage = formattedMessage.replace(
        new RegExp(`#{${param}}`, "g"),
        result
      );
    });
    return formattedMessage;
  },

  send: (subject: string, value: string, to: string[], cc?: string[]) => {
    return axios.post(
      `${config.sendgrid.url}/send`,
      {
        personalizations: [
          {
            to: [...new Set(to)].map((email) => ({ email })),
            cc: cc?.map((email) => ({ email })),
            subject,
          },
        ],
        content: [
          {
            type: "text/html",
            value,
          },
        ],
        from: {
          email: config.sendgrid.sender,
          name: "Jatai",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.sendgrid.key}`,
          "Content-Type": "application/json",
        },
      }
    );
  },
};
