import { EmailService } from "../email.service";

export const WAIT_MEET_TEMPLATE = (keys: {
  name: string;
  goToNextColumnLink: string;
  driveLink: string;
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
      <img src="https://www.jatai.org.br/email/banner_1.png" width="560px" />
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
        Olá, #{name}
      </h1>

      <p
        style="
          color: #000;
          font-size: 16px;
          margin-top: 24px;
          margin-bottom: 24px;
        "
      >
        Te convidamos para agendar sua primeira reunião de alinhamento do seu
        projeto com a equipe da Jataí!
      </p>

      <a
        href="https://calendly.com/eduardospano/jatai-30min"
        style="
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
        >Agendar reunião</a
      >

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          color: #4d4d4d;
          margin-bottom: 24px;
          margin-top: 24px;
          line-height: 24px;
        "
      >
        Caso já tenha sua reunião marcada, pedimos que confirme o seu
        <br />agendamento
        <a
          href="#{goToNextColumnLink}"
          style="
            color: #008040;
            font-weight: 700;
            text-decoration-line: underline;
          "
          >clicando aqui!</a
        >
      </p>

      <p
        style="
          font-size: 14px;
          line-height: 20px;
          padding: 16px;
          color: #000000;
          margin-bottom: 40px;
          border: 0.5px solid #ccc;
          border-radius: 12px;
        "
      >
        Aproveitamos também para compartilhar a pasta do Google Drive onde
        iremos centralizar as documentações e o cronograma do nosso trabalho
        conjunto.
        <a
          href="#{driveLink}"
          style="
            margin-top: 24px;
            background-color: #f3f3f3;
            padding: 14px 24px;
            border-radius: 12px;
            color: #000000;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            text-decoration: none;
          "
          >Acessar Google Drive</a
        >
      </p>
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
