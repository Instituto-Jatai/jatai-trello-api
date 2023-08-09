import { EmailService } from "../email.service";

export const MEETING_DONE_TEMPLATE = (keys: { driveLink: string }) =>
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
        Muito obrigado pela nossa reunião de hoje. Foi ótimo entender melhor o
        contexto da secretaria de vocês e estamos animados em seguir o projeto
        em conjunto.
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
        Com essa reunião, conseguimos as informações necessárias e iniciaremos a
        construção dos documentos.
      </p>

      <p
        style="
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #000000;
        "
      >
        Compartilhamos novamente com vocês a pasta do google drive, a qual você
        irão encontrar o cronograma de trabalho e os documentos que estão sendo
        construídos em tempo real. Para acessar, basta clicar no botão “pasta
        compartilhada”
      </p>

      <a
        href="#{driveLink}"
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
        Pasta compartilhada
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
