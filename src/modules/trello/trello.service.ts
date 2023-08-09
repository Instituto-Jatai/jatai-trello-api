import axios from "axios";
import { Card, Checklist, ChecklistItem, CustomField } from "../../types";
import config from "../../config";
import { BOARD_COLUMNS, CUSTOM_FIELDS } from "../../constants";
import { EmailService } from "../email/email.service";
import { WAIT_MEET_TEMPLATE } from "../email/templates/wait-meet";
import { WAIT_DOC_REVIEW_TEMPLATE } from "../email/templates/wait-doc-review";
import { MEETING_DONE_TEMPLATE } from "../email/templates/meeting-done";
import { WAIT_DOC_LEAD_REVIEW_TEMPLATE } from "../email/templates/wait-doc-lead-review";

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

  createEmailsChecklist: async (
    cardId: string,
    emails: string[],
    isLead = false
  ): Promise<string> => {
    const {
      data: { id },
    } = await axios.post<Checklist>(
      `${config.trello.apiUrl}/checklists?idCard=${cardId}&key=${config.trello.key}&token=${config.trello.token}`,
      {
        name: isLead ? "Aprovação da liderança" : "Emails aguardando aprovação",
      }
    );

    await Promise.all(
      emails.map((email) =>
        axios.post<Checklist>(
          `${config.trello.apiUrl}/checklists/${id}/checkItems?name=${email}&key=${config.trello.key}&token=${config.trello.token}`
        )
      )
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

  checkItem: async (checklistItem: ChecklistItem) => {
    await Promise.all([
      axios.post<Checklist>(
        `${config.trello.apiUrl}/checklists/${checklistItem.idChecklist}/checkItems?name=${checklistItem.name}&checked=true&key=${config.trello.key}&token=${config.trello.token}`
      ),
      axios.delete<ChecklistItem[]>(
        `${config.trello.apiUrl}/checklists/${checklistItem.idChecklist}/checkItems/${checklistItem.id}?key=${config.trello.key}&token=${config.trello.token}`
      ),
    ]);
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

      try {
        await EmailService.send(
          "Jatai - Agendar reunião",
          WAIT_MEET_TEMPLATE({
            driveLink,
            name: representativeName,
            goToNextColumnLink: `${config.apiUrl}/${cardId}/to/${BOARD_COLUMNS[2].id}`,
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

    try {
      const allEmails = [leadEmail];
      const checklistId = await TrelloService.createEmailsChecklist(
        cardId,
        allEmails
      );

      await Promise.all(
        allEmails.map((email) =>
          EmailService.send(
            "Jatai - Aguardando revisão dos documentos",
            WAIT_DOC_LEAD_REVIEW_TEMPLATE({
              driveLink,
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
};
