import config from "../../config";
import {
  BOARD_DOCUMENTS_COLUMNS,
  BOARD_DOCUMENTS_CUSTOM_FIELDS,
} from "../../constants";
import { EmailService } from "../email/email.service";
import { MEETING_DONE_TEMPLATE } from "../email/templates/meeting-done";
import { WAIT_DOC_LEAD_REVIEW_TEMPLATE } from "../email/templates/wait-doc-lead-review";
import { WAIT_DOC_REVIEW_TEMPLATE } from "../email/templates/wait-doc-review";
import { WAIT_DOC_TO_WAPP } from "../email/templates/wait-doc-to-wapp";
import { WAIT_MEET_TEMPLATE } from "../email/templates/wait-meet";
import { TrelloService } from "./trello.service";

export const BoardDocumentsService = {
  sendWaitMeetEmail: async (cardId: string) => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    if (fields.length < BOARD_DOCUMENTS_CUSTOM_FIELDS.length) {
      TrelloService.changeColumn(cardId, BOARD_DOCUMENTS_COLUMNS[0].id);
    } else {
      const representativeJataiEmails = fields
        .find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[0].id,
        )
        ?.value.text.split(",");
      const representativeName =
        fields.find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[1].id,
        )?.value.text || "";
      const representativeEmail =
        fields.find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[2].id,
        )?.value.text || "";
      const driveLink =
        fields.find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[6].id,
        )?.value.text || "";

      const calendlyLink =
        fields.find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[7].id,
        )?.value.text || "";

      try {
        await EmailService.send(
          "Jatai - Agendar reunião",
          WAIT_MEET_TEMPLATE({
            driveLink,
            name: representativeName,
            goToNextColumnLink: `${config.apiUrl}/${cardId}/to/${BOARD_DOCUMENTS_COLUMNS[2].id}`,
            calendlyLink,
          }),
          [representativeEmail],
          representativeJataiEmails,
        );
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    }
  },

  sendMeetingIsDoneEmail: async (cardId: string): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[0].id,
      )
      ?.value.text.split(",");

    const teamEmails =
      fields
        .find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[4].id,
        )
        ?.value.text.split(",") || [];

    const representativeEmail =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[2].id,
      )?.value.text || "";

    const driveLink =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[6].id,
      )?.value.text || "";

    try {
      await EmailService.send(
        "Jatai - Reunião concluida com sucesso",
        MEETING_DONE_TEMPLATE({
          driveLink,
        }),
        [representativeEmail, ...teamEmails],
        representativeJataiEmails,
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  sendWaitReviewEmail: async (cardId: string): Promise<void> => {
    const card = await TrelloService.getCardById(cardId);
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[0].id,
      )
      ?.value.text.split(",");

    const teamEmails =
      fields
        .find(
          (field) =>
            field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[4].id,
        )
        ?.value.text.split(",") || [];

    const representativeEmail =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[2].id,
      )?.value.text || "";

    const phone =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[3].id,
      )?.value.text || "";

    const driveLink =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[6].id,
      )?.value.text || "";

    const calendlyLink =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[7].id,
      )?.value.text || "";

    try {
      const allEmails = [representativeEmail, ...teamEmails];
      const checklistId = await TrelloService.createEmailsChecklist(
        cardId,
        allEmails,
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
            representativeJataiEmails,
          ),
        ),
      );

      await EmailService.send(
        "Jatai - TEMPLATE PARA WHATSAPP",
        WAIT_DOC_TO_WAPP({
          cardName: card.name,
          phone,
        }),
        representativeJataiEmails || [],
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  sendWaitLeadReviewEmail: async (cardId: string): Promise<void> => {
    const fields = await TrelloService.getCustomFieldsByCardId(cardId);

    const representativeJataiEmails = fields
      .find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[0].id,
      )
      ?.value.text.split(",");

    const leadEmail =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[5].id,
      )?.value.text || "";

    const driveLink =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[6].id,
      )?.value.text || "";

    const calendlyLink =
      fields.find(
        (field) => field.idCustomField === BOARD_DOCUMENTS_CUSTOM_FIELDS[7].id,
      )?.value.text || "";

    try {
      const allEmails = [leadEmail];
      const checklistId = await TrelloService.createEmailsChecklist(
        cardId,
        allEmails,
        true,
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
            representativeJataiEmails,
          ),
        ),
      );
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },
};
