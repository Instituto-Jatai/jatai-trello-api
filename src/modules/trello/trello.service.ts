import axios from "axios";
import { Card, Checklist, ChecklistItem, CustomField } from "../../types";
import config from "../../config";
import {
  BOARD_GOING_COLUMNS,
  BOARD_GOING_CUSTOM_FIELDS,
  GOING_CHECKLISTS,
} from "../../constants";
import { EmailService } from "../email/email.service";
import { CHECKLIST_DELAY_TEMPLATE } from "../email/templates/checklist-delay";
import { formatDate, getTotalDaysPastDue } from "../../help";
import { CHECKLIST_DELAY_JATAI_TEMPLATE } from "../email/templates/checklist-delay-jatai";
import { CHECKLIST_RESUME_TEMPLATE } from "../email/templates/checklist-resume";
import { CHECKLIST_DELAY_TOMORROW_TEMPLATE } from "../email/templates/checklist-delay-tomorrow";

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

  createChecklistWithItems: async (
    cardId: string,
    name: string,
    items: string[]
  ): Promise<void> => {
    const checklist = await TrelloService.getChecklistFromCardByName(
      cardId,
      name
    );
    if (!checklist) {
      const checklistID = await TrelloService.createChecklist(cardId, name);

      await Promise.all(
        items.map((item) =>
          TrelloService.createChecklistItem(checklistID, item, 4102521960000)
        )
      );
    }
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

  hasIncompleteItemsInChecklists: async (
    cardId: string,
    checklistName: string
  ): Promise<boolean> => {
    const checklist = await TrelloService.getChecklistFromCardByName(
      cardId,
      checklistName
    );

    return (
      checklist?.checkItems.some(
        (item: ChecklistItem) => item.state === "incomplete"
      ) || false
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

  getChecklistsByCardId: async (cardID: string) => {
    return (
      await axios.get<Checklist[]>(
        `${config.trello.apiUrl}/cards/${cardID}/checklists?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;
  },

  getChecklistFromCardByName: async (cardID: string, name: string) => {
    const checklists = await TrelloService.getChecklistsByCardId(cardID);
    return checklists.find((checklist) => checklist.name === name);
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

  sendEmailToDueItems: async (cards: Card[], checklistName: string) => {
    await Promise.all(
      cards.map(async (card) => {
        const { data } = await axios.get<Checklist[]>(
          `${config.trello.apiUrl}/cards/${card.id}/checklists?name=${checklistName}&key=${config.trello.key}&token=${config.trello.token}`
        );
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 2);
        tomorrow.setHours(23, 59, 59, 0);

        const expiredItem = data
          .find((item) => item.name === checklistName)
          ?.checkItems.sort((a, b) => a.pos - b.pos)
          .find(
            (item) =>
              item.state === "incomplete" &&
              item.due &&
              new Date(item.due) < today
          );

        const expireTomorrow = data
          .find((item) => item.name === checklistName)
          ?.checkItems.sort((a, b) => a.pos - b.pos)
          .find(
            (item) =>
              item.state === "incomplete" &&
              item.due &&
              new Date(item.due) > today &&
              new Date(item.due) < tomorrow
          );

        const fields = await TrelloService.getCustomFieldsByCardId(card.id);
        const contactField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Contato"
        );

        const teamOfSecretariatField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Equipe Secretaria"
        );

        const representativeOfSecretariatField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Representante da Secretaria"
        );

        const jataiTeamField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Equipe Jataí"
        );

        const jataiTeam =
          fields.find((item) => item.idCustomField === jataiTeamField?.id)
            ?.value.text || "";

        const contactLink =
          fields.find((item) => item.idCustomField === contactField?.id)?.value
            .text || "";

        const teamOfSecretariat =
          fields.find(
            (item) => item.idCustomField === teamOfSecretariatField?.id
          )?.value.text || "";

        const representativeOfSecretariat =
          fields.find(
            (item) =>
              item.idCustomField === representativeOfSecretariatField?.id
          )?.value.text || "";

        if (expiredItem) {
          await EmailService.send(
            `Jatai - ${checklistName}`,
            CHECKLIST_DELAY_TEMPLATE({
              contactLink,
              itemName: expiredItem.name,
              date: formatDate(expiredItem.due),
              daysOfDelay: getTotalDaysPastDue(expiredItem.due).toString(),
            }),
            [
              ...teamOfSecretariat.split(",").map((item) => item.trim()),
              ...representativeOfSecretariat
                .split(",")
                .map((item) => item.trim()),
            ]
          );

          await EmailService.send(
            `Time Jatai - ${checklistName}`,
            CHECKLIST_DELAY_JATAI_TEMPLATE({
              cardName: card.name,
              itemName: expiredItem.name,
              date: formatDate(expiredItem.due),
              daysOfDelay: getTotalDaysPastDue(expiredItem.due).toString(),
            }),
            jataiTeam.split(",").map((item) => item.trim())
          );
        }
        if (expireTomorrow) {
          await EmailService.send(
            `Time Jatai - ${checklistName}`,
            CHECKLIST_DELAY_TOMORROW_TEMPLATE({
              contactLink,
              itemName: expireTomorrow.name,
              date: formatDate(expireTomorrow.due),
            }),

            [
              ...teamOfSecretariat.split(",").map((item) => item.trim()),
              ...representativeOfSecretariat
                .split(",")
                .map((item) => item.trim()),
              ...jataiTeam.split(",").map((item) => item.trim()),
            ]
          );
        }
      })
    );
  },

  sendEmailWithWeekResume: async (cards: Card[], checklistName: string) => {
    await Promise.all(
      cards.map(async (card) => {
        const { data } = await axios.get<Checklist[]>(
          `${config.trello.apiUrl}/cards/${card.id}/checklists?name=${checklistName}&key=${config.trello.key}&token=${config.trello.token}`
        );

        const fields = await TrelloService.getCustomFieldsByCardId(card.id);
        const contactField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Contato"
        );

        const teamOfSecretariatField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Equipe Secretaria"
        );

        const representativeOfSecretariatField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Representante da Secretaria"
        );

        const jataiTeamField = BOARD_GOING_CUSTOM_FIELDS.find(
          (item) => item.name === "Equipe Jataí"
        );

        const jataiTeam =
          fields.find((item) => item.idCustomField === jataiTeamField?.id)
            ?.value.text || "";

        const contactLink =
          fields.find((item) => item.idCustomField === contactField?.id)?.value
            .text || "";

        const teamOfSecretariat =
          fields.find(
            (item) => item.idCustomField === teamOfSecretariatField?.id
          )?.value.text || "";

        const representativeOfSecretariat =
          fields.find(
            (item) =>
              item.idCustomField === representativeOfSecretariatField?.id
          )?.value.text || "";

        const incompleteItems = data
          .find((item) => item.name === checklistName)
          ?.checkItems.filter((item) => item.state === "incomplete");

        const completedItems = data
          .find((item) => item.name === checklistName)
          ?.checkItems.filter((item) => item.state === "complete");

        if (incompleteItems && incompleteItems.length > 0) {
          await EmailService.send(
            `Jatai - ${checklistName}`,
            CHECKLIST_RESUME_TEMPLATE(
              {
                contactLink,
              },
              incompleteItems.sort((a, b) => a.pos - b.pos),
              completedItems
            ),
            [
              ...teamOfSecretariat.split(",").map((item) => item.trim()),
              ...representativeOfSecretariat
                .split(",")
                .map((item) => item.trim()),
              ...jataiTeam.split(",").map((item) => item.trim()),
            ]
          );
        }
      })
    );
  },

  notifyDueChecklistItems: async () => {
    const secondColumnItems = await axios.get<Card[]>(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[1].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );
    const thirdColumnItems = await axios.get(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[2].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );
    const fourthColumnItems = await axios.get(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[3].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );

    await TrelloService.sendEmailToDueItems(
      secondColumnItems.data,
      GOING_CHECKLISTS.secondColumn.name
    );
    await TrelloService.sendEmailToDueItems(
      thirdColumnItems.data,
      GOING_CHECKLISTS.thirdColumn.name
    );
    await TrelloService.sendEmailToDueItems(
      fourthColumnItems.data,
      GOING_CHECKLISTS.fourthColumn.name
    );
  },

  sendWeekResume: async () => {
    const secondColumnItems = await axios.get<Card[]>(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[1].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );
    const thirdColumnItems = await axios.get<Card[]>(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[2].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );
    const fourthColumnItems = await axios.get<Card[]>(
      `${config.trello.apiUrl}/lists/${BOARD_GOING_COLUMNS[3].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
    );

    if (secondColumnItems.data.length > 0) {
      await TrelloService.sendEmailWithWeekResume(
        secondColumnItems.data,
        GOING_CHECKLISTS.secondColumn.name
      );
    }
    if (thirdColumnItems.data.length > 0) {
      await TrelloService.sendEmailWithWeekResume(
        thirdColumnItems.data,
        GOING_CHECKLISTS.thirdColumn.name
      );
    }
    if (fourthColumnItems.data.length > 0) {
      await TrelloService.sendEmailWithWeekResume(
        fourthColumnItems.data,
        GOING_CHECKLISTS.fourthColumn.name
      );
    }
  },
};
