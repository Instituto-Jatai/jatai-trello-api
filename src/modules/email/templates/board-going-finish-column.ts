import { EmailService } from "../email.service";

export const BOARD_GOING_FINISH_COLUMN = (keys: {
  step: string;
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
        Olá,
      </h1>
      <p
        style="
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
        "
      >
        Temos uma ótima notícia!
      </p>
      <p
        style="
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
        "
      >
        A #{step} foi finalizada com sucesso!
      </p>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          margin-bottom: 24px;
          color: #000000;
        "
      >
        Em breve entraremos em contato para apresentar as próximas etapas do
        processo.
      </p>
      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          margin-bottom: 54px;
        "
      >
        Caso surjam dúvidas não hesitem em entrar em contato conosco pelo botão
        abaixo:
      </p>

      <a
        href="#{contactLink}"
        style="
          gap: 8px;
          color: #fff;
          padding: 14px 24px;
          margin-right: auto;
          border-radius: 12px;
          background: #008040;
          cursor: pointer;
          display: inline;
        "
        >Entrar em contato</a
      >

      <p
        style="
        margin-top: 40px;
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
