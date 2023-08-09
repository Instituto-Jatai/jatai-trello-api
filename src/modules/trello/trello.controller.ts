import { Request, Response } from "express";
import { Body } from "../../types";
import { BOARD_COLUMNS, HTML_SUCCESS_TEMPLATE } from "../../constants";
import { TrelloService } from "./trello.service";

export const TrelloController = {
  toNewColumn: async (
    req: Request<{ cardId: string; newColumnId: string }>,
    res: Response
  ) => {
    const cardId = req.params.cardId;
    const newColumnId = req.params.newColumnId;

    const card = await TrelloService.getCardById(cardId);

    const beforeColumn =
      BOARD_COLUMNS.findIndex((item) => item.id === newColumnId) - 1;

    if (card.idList === BOARD_COLUMNS[beforeColumn].id) {
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
      await TrelloService.checkItem(currentItem);
    }

    const openItems = checklistItems.filter(
      (item) => item.state === "incomplete" && item.id !== currentItem?.id
    );

    if (openItems.length === 0) {
      if (card.idList === BOARD_COLUMNS[6].id) {
        TrelloService.changeColumn(cardId, BOARD_COLUMNS[7].id);
      } else {
        TrelloService.changeColumn(cardId, BOARD_COLUMNS[5].id);
      }
    }

    res.status(200).send(HTML_SUCCESS_TEMPLATE);
  },

  webhook: async (req: Request<null, null, Body>, res: Response) => {
    const body = req.body;

    if (body.action.data.card?.idList) {
      switch (body.action.data.card?.idList) {
        case BOARD_COLUMNS[1].id:
          await TrelloService.sendWaitMeetEmail(body.action.data.card.id);
          break;
        case BOARD_COLUMNS[3].id:
          await TrelloService.sendMeetingIsDoneEmail(body.action.data.card.id);
          break;
        case BOARD_COLUMNS[4].id:
          await TrelloService.sendWaitReviewEmail(body.action.data.card.id);
          break;
        case BOARD_COLUMNS[6].id:
          await TrelloService.sendWaitLeadReviewEmail(body.action.data.card.id);
          break;
      }
    }

    res.status(200).send();
  },
};
