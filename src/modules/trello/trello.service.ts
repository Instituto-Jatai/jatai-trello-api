import axios from "axios";
import { Body, Card, CustomField } from "../../types";
import config from "../../config";
import { BOARD_COLUMNS, CUSTOM_FIELDS } from "../../constants";
import { EmailService } from "../email/email.service";
import { WAIT_FORM_TEMPLATE } from "../email/templates/wait-form";
import { WAIT_AGREE_TEMPLATE } from "../email/templates/wait-agree";
import { WAIT_SUBSCRIPTION } from "../email/templates/wait-subscription";

export const TrelloService = {
  getCardById: async (id: string): Promise<Card> => {
    return (
      await axios.get<Card>(
        `${config.trello.apiUrl}/cards/${id}?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;
  },

  getCustomFieldsByCardId: async (id: string): Promise<CustomField[]> => {
    return (
      await axios.get<CustomField[]>(
        `${config.trello.apiUrl}/cards/${id}/customFieldItems?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;
  },

  changeColumn: async (id: string, idList: string): Promise<void> => {
    await axios.put<Card>(
      `${config.trello.apiUrl}/cards/${id}?key=${config.trello.key}&token=${config.trello.token}`,
      { idList }
    );
  },

  sendFormEmail: async (body: Body): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(
      body.action.data.card.id
    );

    if (fields.length < 3) {
      TrelloService.changeColumn(body.action.data.card.id, BOARD_COLUMNS[0].id);
    } else {
      const email = fields.find(
        (field) => field.idCustomField === CUSTOM_FIELDS.commonEmail
      )?.value.text;

      if (email) {
        await EmailService.send(
          "Jatai - Preencha o formulário",
          email,
          WAIT_FORM_TEMPLATE,
          {
            name: body.action.data.card.name,
            formLink: `${config.apiUrl}/form/${body.action.data.card.id}`,
          }
        );
      }
    }
  },

  sendAgreeEmail: async (body: Body, toLead?: boolean): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(
      body.action.data.card.id
    );

    const email = fields.find(
      (field) =>
        field.idCustomField ===
        (toLead ? CUSTOM_FIELDS.leadEmail : CUSTOM_FIELDS.commonEmail)
    )?.value.text;

    const docLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS.docsLink)
        ?.value.text || "";

    if (email) {
      await EmailService.send(
        "Jatai - Revisão do documento",
        email,
        WAIT_AGREE_TEMPLATE,
        {
          docLink,
          name: body.action.data.card.name,
          agreeLink: `https://9dad-189-49-234-93.ngrok-free.app/trello/doc-agree/${body.action.data.card.id}`,
          rejectLink: `https://9dad-189-49-234-93.ngrok-free.app/trello/doc-reject/${body.action.data.card.id}`,
        }
      );
    }
  },

  sendSubscriptionEmail: async (body: Body): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(
      body.action.data.card.id
    );

    const email = fields.find(
      (field) => field.idCustomField === CUSTOM_FIELDS.leadEmail
    )?.value.text;

    if (email) {
      await EmailService.send(
        "Jatai - Assinatura do documento",
        email,
        WAIT_SUBSCRIPTION,
        {
          name: body.action.data.card.name,
          subscriptionLink: "https://www.autentique.com.br/",
        }
      );
    }
  },
};
