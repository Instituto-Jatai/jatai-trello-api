import { EmailService } from "../email.service";

export const CHECKLIST_DELAY_JATAI_TEMPLATE = (keys: {
  cardName: string;
  itemName: string;
  daysOfDelay: string;
  date: string;
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
          Olá, Jataí!
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
          Analisamos nossos dados e identificamos que <b>#{cardName}</b> está em
          atraso com <b>#{itemName}</b>
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
          O atraso é de #{daysOfDelay} dias e o prazo de finalização era em
          #{date}.
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
          Abaixo trazemos uma sugestão de mensagem para que entrem em contato com
          <b>#{cardName}</b> e entendam as dificuldades enfrentadas.
        </p>
  
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #000000;
            margin-bottom: 24px;
            padding: 16px;
            background: #f0f0f0;
            border-radius: 12px;
          "
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          feugiat enim eu sollicitudin consectetur. In vitae pharetra lectus.
          Praesent laoreet leo purus, ac condimentum enim accumsan et. Aenean
          scelerisque volutpat ipsum a facilisis. Praesent imperdiet in purus in
          ornare. Aliquam sed tincidunt augue, ac dictum arcu.
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
