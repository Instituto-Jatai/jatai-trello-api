import { EmailService } from "../email.service";

export const WAIT_DOC_LEAD_REVIEW_TEMPLATE = (keys: {
  approveLink: string;
  driveLink: string;
  calendlyLink: string;
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
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
          margin-bottom: 24px;
        "
      >
        Os documentos foram aprovados pela sua equipe.<br />
        Para acessá-los, basta entrar em nossa
        <a
          href="#{driveLink}"
          style="
            color: #008040;
            font-weight: 600;
            text-decoration-line: underline;
          "
          >pasta compartilhada no Google Drive</a
        >
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
        Pedimos que revisem o documento e façam <b>comentários</b> caso existam
        alterações que precisem ser realizadas para aprovação.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
        "
      >
        Se o documento estiver correto, você pode aprová-lo automaticamente
        clicando no botão abaixo:
      </p>

      <a
        href="#{approveLink}"
        style="
          margin-top: 24px;
          margin-bottom: 40px;
          display: inline-block;
          padding: 14px 24px;
          background-color: #008040;
          color: #ffffff;
          text-decoration: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        "
      >
        Aprovar documento
      </a>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
        "
      >
        Caso achem necessário um momento para discutir alguma pauta específica,
        a qual não pode ser resolvida através dos comentários do documento, por
        favor, agende uma reunião conosco para agilizarmos o processo.
      </p>

      <a
        href="#{calendlyLink}"
        style="
          margin-top: 24px;
          margin-bottom: 40px;
          background-color: #f3f3f3;
          padding: 14px 24px;
          border-radius: 12px;
          color: #000000;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          text-decoration: none;
        "
      >
        Agendar reunião
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
    keys
  );
