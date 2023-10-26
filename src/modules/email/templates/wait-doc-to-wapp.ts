import { EmailService } from "../email.service";

export const WAIT_DOC_TO_WAPP = (keys: { cardName: string; phone: string }) =>
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
        Os documentos da #{cardName} estão prontos.<br />
        Segue o contato do responsável: <a href="https://wa.me/55#{phone}" target="_blank"><b>#{phone}</b></a>
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
        Quem sabe enviamos para o pessoal envolvido no whatsapp o seguinte
        texto:
      </p>

      <div
        style="
          border-radius: 12px;
          padding: 12px;
          border: 1px solid #008040;
          background-color: #e8f5e9;
        "
      >
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #000000;
          "
        >
          Olá, Sou da equipe da Jatai e estou como responsável pelo
          relacionamento com a sua secretaria.
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
          Tenho uma ótima notícia!
        </p>

        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #000000;
          "
        >
          Seus respectivos documentos estão prontos!
        </p>

        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #000000;
          "
        >
          Acabei de lhe enviar um e-mail com todas as instruções para aprovarmos
          a documentação. Alterações devem ser feitas como comentários no
          documento e, no corpo do e-mail, existem botões que podem aprovar ou
          agendar uma reunião conosco para discutirmos alterações.
        </p>
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #000000;
          "
        >
          Fico no seu aguardo! Qualquer dúvida, estou à disposição.
        </p>
      </div>
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
