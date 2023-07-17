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
        result,
      );
    });
    return formattedMessage;
  },

  send: (
    subject: string,
    mailTo: string,
    content: string,
    keys?: TagReplacers,
  ) => {
    return axios.post(
      `${config.sendgrid.url}/send`,
      {
        personalizations: [
          {
            to: [{ email: mailTo }],
            subject,
          },
        ],
        content: [
          {
            type: "text/html",
            value: keys
              ? EmailService.messageFormatter(content, keys)
              : content,
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
      },
    );
  },
};
