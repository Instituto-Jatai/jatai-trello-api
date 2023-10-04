import axios from "axios";
import {
  Action,
  Card,
  Checklist,
  ChecklistItem,
  CustomField,
} from "../../types";
import config from "../../config";
import {
  BOARD_COLUMNS,
  BOARD_GOING_COLUMNS,
  CUSTOM_FIELDS,
} from "../../constants";
import { EmailService } from "../email/email.service";
import { WAIT_MEET_TEMPLATE } from "../email/templates/wait-meet";
import { WAIT_DOC_REVIEW_TEMPLATE } from "../email/templates/wait-doc-review";
import { MEETING_DONE_TEMPLATE } from "../email/templates/meeting-done";
import { WAIT_DOC_LEAD_REVIEW_TEMPLATE } from "../email/templates/wait-doc-lead-review";
import { WAIT_DOC_TO_WAPP } from "../email/templates/wait-doc-to-wapp";

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

  createChecklist: async (cardId: string, name: string): Promise<string> => {
    const {
      data: { id },
    } = await axios.post<Checklist>(
      `${config.trello.apiUrl}/checklists?idCard=${cardId}&key=${config.trello.key}&token=${config.trello.token}`,
      {
        name,
      }
    );
    return id;
  },

  createChecklistItem: async (
    checklistID: string,
    name: string,
    pos?: number,
    due?: string
  ) => {
    return axios.post<ChecklistItem>(
      `${
        config.trello.apiUrl
      }/checklists/${checklistID}/checkItems?name=${name}&key=${
        config.trello.key
      }&token=${config.trello.token}${pos ? `&pos=${pos}` : ""}${
        due ? `&due=${due}` : ""
      }`
    );
  },

  updateChecklistItem: async (
    cardID: string,
    checklistID: string,
    checklistItemID: string,
    checklistItem: Partial<ChecklistItem>
  ) => {
    return axios.put<ChecklistItem>(
      `${config.trello.apiUrl}/cards/${cardID}/checklist/${checklistID}/checkItem/${checklistItemID}?&key=${config.trello.key}&token=${config.trello.token}`,
      checklistItem
    );
  },

  createEmailsChecklist: async (
    cardId: string,
    emails: string[],
    isLead = false
  ): Promise<string> => {
    const id = await TrelloService.createChecklist(
      cardId,
      isLead ? "Aprovação da liderança" : "Emails aguardando aprovação"
    );

    await Promise.all(
      emails.map((email) => TrelloService.createChecklistItem(id, email))
    );

    return id;
  },

  getChecklistItems: async (checklistId: string) => {
    return (
      await axios.get<ChecklistItem[]>(
        `${config.trello.apiUrl}/checklists/${checklistId}/checkItems?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;
  },

  deleteChecklistItem: async (checklistId: string, checklistItemID: string) => {
    await axios.delete(
      `${config.trello.apiUrl}/checklists/${checklistId}/checkItems/${checklistItemID}?key=${config.trello.key}&token=${config.trello.token}`
    );
  },

  sendWaitMeetEmail: async (cardId: string) => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    if (fields.length < CUSTOM_FIELDS.length) {
      TrelloService.changeColumn(cardId, BOARD_COLUMNS[0].id);
    } else {
      const representativeJataiEmails = fields
        .find((field) => field.idCustomField === CUSTOM_FIELDS[0].id)
        ?.value.text.split(",");
      const representativeName =
        fields.find((field) => field.idCustomField === CUSTOM_FIELDS[1].id)
          ?.value.text || "";
      const representativeEmail =
        fields.find((field) => field.idCustomField === CUSTOM_FIELDS[2].id)
          ?.value.text || "";
      const driveLink =
        fields.find((field) => field.idCustomField === CUSTOM_FIELDS[6].id)
          ?.value.text || "";

      const calendlyLink =
        fields.find((field) => field.idCustomField === CUSTOM_FIELDS[7].id)
          ?.value.text || "";

      try {
        await EmailService.send(
          "Jatai - Agendar reunião",
          WAIT_MEET_TEMPLATE({
            driveLink,
            name: representativeName,
            goToNextColumnLink: `${config.apiUrl}/${cardId}/to/${BOARD_COLUMNS[2].id}`,
            calendlyLink,
          }),
          [representativeEmail],
          representativeJataiEmails
        );
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    }
  },

  sendMeetingIsDoneEmail: async (cardId: string): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find((field) => field.idCustomField === CUSTOM_FIELDS[0].id)
      ?.value.text.split(",");

    const teamEmails =
      fields
        .find((field) => field.idCustomField === CUSTOM_FIELDS[4].id)
        ?.value.text.split(",") || [];

    const representativeEmail =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[2].id)?.value
        .text || "";

    const driveLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[6].id)?.value
        .text || "";

    try {
      await EmailService.send(
        "Jatai - Reunião concluida com sucesso",
        MEETING_DONE_TEMPLATE({
          driveLink,
        }),
        [representativeEmail, ...teamEmails],
        representativeJataiEmails
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  sendWaitReviewEmail: async (cardId: string): Promise<void> => {
    const card = await TrelloService.getCardById(cardId);
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find((field) => field.idCustomField === CUSTOM_FIELDS[0].id)
      ?.value.text.split(",");

    const teamEmails =
      fields
        .find((field) => field.idCustomField === CUSTOM_FIELDS[4].id)
        ?.value.text.split(",") || [];

    const representativeEmail =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[2].id)?.value
        .text || "";

    const phone =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[3].id)?.value
        .text || "";

    const driveLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[6].id)?.value
        .text || "";

    const calendlyLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[7].id)?.value
        .text || "";

    try {
      const allEmails = [representativeEmail, ...teamEmails];
      const checklistId = await TrelloService.createEmailsChecklist(
        cardId,
        allEmails
      );

      await Promise.all(
        allEmails.map((email) =>
          EmailService.send(
            "Jatai - Aguardando revisão dos documentos",
            WAIT_DOC_REVIEW_TEMPLATE({
              driveLink,
              calendlyLink,
              approveLink: `${config.apiUrl}/${cardId}/${checklistId}/approve/${email}`,
            }),
            [email],
            representativeJataiEmails
          )
        )
      );

      await EmailService.send(
        "Jatai - TEMPLATE PARA WHATSAPP",
        WAIT_DOC_TO_WAPP({
          cardName: card.name,
          phone,
        }),
        representativeJataiEmails || []
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  sendWaitLeadReviewEmail: async (cardId: string): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find((field) => field.idCustomField === CUSTOM_FIELDS[0].id)
      ?.value.text.split(",");

    const leadEmail =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[5].id)?.value
        .text || "";

    const driveLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[6].id)?.value
        .text || "";

    const calendlyLink =
      fields.find((field) => field.idCustomField === CUSTOM_FIELDS[7].id)?.value
        .text || "";

    try {
      const allEmails = [leadEmail];
      const checklistId = await TrelloService.createEmailsChecklist(
        cardId,
        allEmails,
        true
      );

      await Promise.all(
        allEmails.map((email) =>
          EmailService.send(
            "Jatai - Aguardando revisão dos documentos",
            WAIT_DOC_LEAD_REVIEW_TEMPLATE({
              driveLink,
              calendlyLink,
              approveLink: `${config.apiUrl}/${cardId}/${checklistId}/approve/${email}`,
            }),
            [email],
            representativeJataiEmails
          )
        )
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  handleBoardGoingSecondColumn: async (action: Action): Promise<void> => {
    try {
      if (
        action.type === "updateCard" &&
        action.data.card.idList &&
        action.data.old.idList
      ) {
        if (action.data.old.idList !== BOARD_GOING_COLUMNS[0].id) {
          await TrelloService.changeColumn(
            action.data.card.id,
            action.data.old.idList
          );
        } else {
          const checklistID = await TrelloService.createChecklist(
            action.data.card.id,
            "Edital de Pregão"
          );

          await Promise.all(
            [
              "Pesquisa de Preço",
              "Aprovação Financeira",
              "Produzir o Edital",
              "Autorização do ordenador de despesa",
              "Parecer jurídico",
              "Parecer do controle",
              "Publicar o edital",
            ].map((item) =>
              TrelloService.createChecklistItem(
                checklistID,
                item,
                4102521960000
              )
            )
          );
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },
};
