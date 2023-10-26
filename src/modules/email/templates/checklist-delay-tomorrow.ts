import { EmailService } from "../email.service";

export const CHECKLIST_DELAY_TOMORROW_TEMPLATE = (keys: {
  itemName: string;
  date: string;
  contactLink: string;
}) =>
  EmailService.messageFormatter(
    `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        font-family: "Inter", sans-serif;
      }
    </style>
  </head>
  <body style="background-color: #ffffff; padding: 24px">
    <div style="margin: auto; display: table">
      <img src="https://www.jatai.org.br/email/banner_2.png" width="560px" />
    </div>

    <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff">
      <h1
        style="
          font-size: 24px;
          color: #008040;
          margin-top: 40px;
          font-weight: 700;
        "
      >
        Olá, pessoal!
      </h1>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          margin-bottom: 24px;
        "
      >
      Gostaríamos de relembrar que a data programada para a finalização do item <b>#{itemName}</b>  é amanhã, #{date}.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          margin-bottom: 24px;
        "
      >
      Reforçamos que estamos à disposição para ajudá-los em qualquer etapa do processo.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          margin-bottom: 24px;
        "
      >
      Não hesitem em nos contatar!
      </p>
      
      <a
        href="#{contactLink}"
        style="
          margin: 40px 0;
          gap: 8px;
          color: #fff;
          padding: 14px 24px;
          margin-right: auto;
          border-radius: 12px;
          background: #008040;
          cursor: pointer;
          text-decoration: none;
          display: inline;
        "
      >
        Entrar em contato
      </a>
      <p
        style="
          margin-bottom: 0;
          color: #4d4d4d;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
        "
      >
        Ate breve,
      </p>
      <p
        style="
          font-size: 16px;
          margin-top: 0;
          color: #008040;
          font-weight: 600;
          line-height: 24px;
        "
      >
        Equipe Jataí
      </p>
    </div>
  </body>
</html>
    `,
    keys,
  );
