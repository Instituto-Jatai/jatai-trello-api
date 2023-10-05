import axios from "axios";
import { Card, Checklist, ChecklistItem, CustomField } from "../../types";
import config from "../../config";

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
};
