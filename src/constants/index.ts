export const allowedOrigins = ["http://localhost:3000"];

export const BOARD_DOCUMENTS_COLUMNS = [
  {
    id: "64c920a724c5852bb74adffe",
    name: "Novas secretarias",
  },
  {
    id: "64c920b54e8b628a31e46b93",
    name: "Agendamento de reunião",
  },
  {
    id: "64c920bf3b3837d8a59ffba9",
    name: "Reunião agendada",
  },
  {
    id: "64c9265eda7c9ea01bd61490",
    name: "Produção do documento",
  },
  {
    id: "64c927336a2de3293c028684",
    name: "Aguardando revisão",
  },
  {
    id: "64c9276dc906f66667da17b1",
    name: "Aprovado equipe técnica",
  },
  {
    id: "64c9277a3d90bd7774c4d27c",
    name: "Aprovação da liderança",
  },
  {
    id: "64c927a9c32c4cfb7e7de7b0",
    name: "Aguardando assinaturas",
  },
  {
    id: "64c927b65278739b860b561d",
    name: "Documentos aprovados e assinados",
  },
];

export const BOARD_DOCUMENTS_CUSTOM_FIELDS = [
  {
    id: "64c91c538790f9dde83f1208",
    idModel: "64c908a74f49d78967e93126",
    name: "Emails da jataí",
  },
  {
    id: "64c922729edfa0457ef44db8",
    idModel: "64c908a74f49d78967e93126",
    name: "Representante da secretaria - Nome",
  },
  {
    id: "64c91ce37bd7ea5e8c7caf1b",
    idModel: "64c908a74f49d78967e93126",
    name: "Representante da secretaria - Email",
  },
  {
    id: "64c91d6af1d2ec448ed8b5b0",
    idModel: "64c908a74f49d78967e93126",
    name: "Representante da secretaria - Telefone",
  },
  {
    id: "64c91d0ee7e43692b5e92c39",
    idModel: "64c908a74f49d78967e93126",
    name: "Emails da equipe da secretaria",
  },
  {
    id: "64c9212b1acab2bb8f257631",
    idModel: "64c908a74f49d78967e93126",
    name: "Email da liderança da secretaria",
  },
  {
    id: "64c91d8123a2f287864f7147",
    idModel: "64c908a74f49d78967e93126",
    name: "Link do drive",
  },
  {
    id: "64dd469433bc3dafca5cc4e2",
    idModel: "64c908a74f49d78967e93126",
    name: "Calendly",
  },
];

export const HTML_SUCCESS_TEMPLATE = `
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
    <title>Jataí</title>
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
        Obrigado, agradecemos sua colaboração.
      </h1>

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
`;

export const BOARD_GOING_COLUMNS = [
  {
    id: "6515926c3c497cc8d47dec78",
    name: "Backlog",
  },
  {
    id: "651592758346e35adcd76a19",
    name: "Edital de Pregão",
  },
  {
    id: "6515927c22676c41d7230fa1",
    name: "Licitação realizada",
  },
  {
    id: "65159283d2a04c041727c67d",
    name: "Contrato assinado",
  },
  {
    id: "65159292cdd2b9d25671d120",
    name: "Oficina de Fiscalização",
  },
  {
    id: "65159299717c06f821236945",
    name: "Finalizado",
  },
];

export const GOING_CHECKLISTS = {
  secondColumn: {
    name: "Edital de Pregão",
    items: [
      "Pesquisa de Preço",
      "Aprovação Financeira",
      "Produzir o Edital",
      "Autorização do ordenador de despesa",
      "Parecer jurídico",
      "Parecer do controle",
      "Publicar o edital",
    ],
  },
  thirdColumn: {
    name: "Licitação realizada",
    items: [
      "Receber propostas",
      "Aceitar proposta",
      "Realizar prova de conceito",
      "Receber e responder recursos",
      "Parecer jurídico",
      "Homologar licitação",
      "Adjudicar licitação",
      "Publicar o resultado",
    ],
  },
  fourthColumn: {
    name: "Contrato assinado",
    items: [
      "Solicitar autorização do gestor",
      "Anuência da empresa",
      "Pesquisa de preço",
      "Aprovação financeira",
      "Parecer jurídico",
      "Parecer do controle",
      "Ordenador de despesa assina o contrato",
      "Contrato assinado pela empresa",
      "Registrar no sistema de gestão",
      "Publicar o contrato",
    ],
  },
  fifthColumn: {
    name: "Oficina de Fiscalização",
    items: [
      "Definir integrantes da oficina",
      "Agendar oficina",
      "Preparar oficina",
      "Realizar oficina",
      "Avaliar oficina",
    ],
  },
};

export const BOARD_GOING_CUSTOM_FIELDS = [
  {
    id: "651da963781ed150a84f54c0",
    name: "Equipe Jataí",
  },
  {
    id: "651da971d3464ed1c8d53a89",
    name: "Equipe Secretaria",
  },
  {
    id: "651da97ae92f96fbcc2adb09",
    name: "Liderança da Secretaria",
  },
  {
    id: "651da983ed718701c8d3d279",
    name: "Parceiros",
  },
  {
    id: "651da98c5ecbdd2e2ee9ac6e",
    name: "Representante da Secretaria",
  },
  {
    id: "651ed6d1702e59b973b454df",
    name: "Contato",
  },
];
