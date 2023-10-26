import { formatDate } from "../../../help";
import { ChecklistItem } from "../../../types";
import { EmailService } from "../email.service";

export const CHECKLIST_RESUME_TEMPLATE = (
  keys: {
    contactLink: string;
  },
  pendingItems?: ChecklistItem[],
  completedItems?: ChecklistItem[],
) =>
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
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 20px;
            color: #000000;
          "
        >
          Como de costume, enviamos este e-mail para alinharmos nossas demandas
          pendentes.
        </p>
  
        <div
          style="
            border-radius: 12px;
            border: 1px solid #ddd;
            padding: 16px;
            margin-bottom: 50px;
          "
        >
          <p style="font-weight: 600; font-size: 20px">Itens</p>
          <p style="font-weight: 600">Pendentes:</p>
          ${pendingItems
            ?.map(
              (item) => `
          <table border="0" style="margin: 20px 0px;">
            <tr>
              <td rowspan="2" style="width: 24px;">
                <input type="radio"/>
              </td>

              <td>
                <p style="margin: 0; font-weight: 500; color: #666666">
                  ${item.name}
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <p style="margin: 0; font-weight: 600">Prazo: ${
                  item.due ? formatDate(item.due) : "Não definido"
                }</p>
              </td>
            </tr>
          </table>
          `,
            )
            .join("")}
  
          <p style="font-weight: 600">Concluídos:</p>

          ${completedItems
            ?.map(
              (item) => `
            <table border="0" style="margin: 20px 0px;">
              <tr>
                <td rowspan="2" style="width: 24px;">
                  <input type="radio" checked />
                </td>

                <td>
                  <p style="margin: 0; font-weight: 500; color: #666666">
                    ${item.name}
                  </p>
                </td>
              </tr>
            </table>
          `,
            )
            .join("")}
          
        </div>
  
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
            text-decoration: none;
            display: inline;
          "
        >
          Entrar em contato
        </a>
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
