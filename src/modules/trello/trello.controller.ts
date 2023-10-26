import { Request, Response } from "express";
import { Body } from "../../types";
import {
  BOARD_DOCUMENTS_COLUMNS,
  BOARD_GOING_COLUMNS,
  BOARD_GOING_CUSTOM_FIELDS,
  HTML_SUCCESS_TEMPLATE,
} from "../../constants";
import { TrelloService } from "./trello.service";
import { BoardGoingService } from "./board.going.service";
import { BoardDocumentsService } from "./board.documents.service";

export const TrelloController = {
  toNewColumn: async (
    req: Request<{ cardId: string; newColumnId: string }>,
    res: Response
  ) => {
    const cardId = req.params.cardId;
    const newColumnId = req.params.newColumnId;

    const card = await TrelloService.getCardById(cardId);

    const beforeColumn =
      BOARD_DOCUMENTS_COLUMNS.findIndex((item) => item.id === newColumnId) - 1;

    if (card.idList === BOARD_DOCUMENTS_COLUMNS[beforeColumn].id) {
      await TrelloService.changeColumn(cardId, newColumnId);
    }

    res.status(200).send(HTML_SUCCESS_TEMPLATE);
  },

  approve: async (
    req: Request<{ cardId: string; checklistId: string; email: string }>,
    res: Response
  ) => {
    const cardId = req.params.cardId;
    const checklistId = req.params.checklistId;
    const email = req.params.email;

    const card = await TrelloService.getCardById(cardId);

    const checklistItems = await TrelloService.getChecklistItems(checklistId);

    const currentItem = checklistItems.find((item) => item.name === email);

    if (currentItem && currentItem.state === "incomplete") {
      await TrelloService.updateChecklistItem(
        cardId,
        checklistId,
        currentItem.id,
        { state: "complete" }
      );
    }

    const openItems = checklistItems.filter(
      (item) => item.state === "incomplete" && item.id !== currentItem?.id
    );

    if (openItems.length === 0) {
      if (card.idList === BOARD_DOCUMENTS_COLUMNS[6].id) {
        TrelloService.changeColumn(cardId, BOARD_DOCUMENTS_COLUMNS[7].id);
      } else {
        TrelloService.changeColumn(cardId, BOARD_DOCUMENTS_COLUMNS[5].id);
      }
    }

    res.status(200).send(HTML_SUCCESS_TEMPLATE);
  },

  webhookDocuments: async (req: Request<null, null, Body>, res: Response) => {
    const body = req.body;

    if (body.action.data.card?.idList) {
      switch (body.action.data.card?.idList) {
        case BOARD_DOCUMENTS_COLUMNS[1].id:
          await BoardDocumentsService.sendWaitMeetEmail(
            body.action.data.card.id
          );
          break;
        case BOARD_DOCUMENTS_COLUMNS[3].id:
          await BoardDocumentsService.sendMeetingIsDoneEmail(
            body.action.data.card.id
          );
          break;
        case BOARD_DOCUMENTS_COLUMNS[4].id:
          await BoardDocumentsService.sendWaitReviewEmail(
            body.action.data.card.id
          );
          break;
        case BOARD_DOCUMENTS_COLUMNS[6].id:
          await BoardDocumentsService.sendWaitLeadReviewEmail(
            body.action.data.card.id
          );
          break;
      }
    }

    res.status(200).send();
  },

  webhookGoing: async (req: Request<null, null, Body>, res: Response) => {
    const action = req.body.action;

    if (
      action.type === "updateCard" &&
      action.data.card.idList &&
      action.data.old.idList
    ) {
      const fields = await TrelloService.getCustomFieldsByCardId(
        action.data.card.id
      );
      const jataiTeam = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[0].id
      )?.value;
      const clientTeam = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[1].id
      )?.value;
      const clientLead = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[2].id
      )?.value;
      const partners = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[3].id
      )?.value;
      const clientDelegate = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[4].id
      )?.value;
      const contactLink = fields.find(
        (field) => field.idCustomField === BOARD_GOING_CUSTOM_FIELDS[5].id
      )?.value;

      if (
        jataiTeam &&
        clientTeam &&
        clientLead &&
        partners &&
        clientDelegate &&
        contactLink
      ) {
        const emails = [
          ...jataiTeam.text.split(","),
          ...clientTeam.text.split(","),
          ...clientLead.text.split(","),
          ...partners.text.split(","),
          ...clientDelegate.text.split(","),
        ];

        switch (action.data.card.idList) {
          case BOARD_GOING_COLUMNS[0].id:
            console.log("handleBoardGoingFirstColumn");
            break;

          case BOARD_GOING_COLUMNS[1].id:
            console.log("handleBoardGoingSecondColumn");
            await BoardGoingService.handleBoardGoingSecondColumn(
              action.data.card.id,
              action.data.old.idList
            );
            break;

          case BOARD_GOING_COLUMNS[2].id:
            console.log("handleBoardGoingThirdColumn");
            await BoardGoingService.handleBoardGoingThirdColumn(
              action.data.card.id,
              action.data.old.idList,
              emails,
              contactLink.text
            );
            break;

          case BOARD_GOING_COLUMNS[3].id:
            console.log("handleBoardGoingFourthColumn");
            await BoardGoingService.handleBoardGoingFourthColumn(
              action.data.card.id,
              action.data.old.idList,
              emails,
              contactLink.text
            );
            break;

          case BOARD_GOING_COLUMNS[4].id:
            console.log("handleBoardGoingFifthColumn");
            await BoardGoingService.handleBoardGoingFifthColumn(
              action.data.card.id,
              action.data.old.idList,
              emails,
              contactLink.text
            );
            break;

          case BOARD_GOING_COLUMNS[5].id:
            console.log("handleBoardGoingFSixthColumn");
            await BoardGoingService.handleBoardGoingFSixthColumn(
              action.data.card.id,
              action.data.old.idList,
              emails,
              contactLink.text
            );
            break;

          default:
            break;
        }
      } else {
        await TrelloService.changeColumn(
          action.data.card.id,
          BOARD_GOING_COLUMNS[0].id
        );
      }
    }

    if (
      action.type === "updateCheckItemDue" &&
      action.data.checklist &&
      action.data.checkItem
    ) {
      await TrelloService.updateChecklistItem(
        action.data.card.id,
        action.data.checklist.id,
        action.data.checkItem.id,
        {
          pos: new Date(action.data.checkItem.due).getTime(),
        }
      );
    }

    res.status(200).send();
  },

  headOk: async (_req: Request, res: Response) => {
    res.status(200).send();
  },

  testSchedule: async (_req: Request, res: Response) => {
    await TrelloService.notifyDueChecklistItems();
    res.status(200).send();
  },

  testResume: async (_req: Request, res: Response) => {
    await TrelloService.sendWeekResume();
    res.status(200).send();
  },
};
