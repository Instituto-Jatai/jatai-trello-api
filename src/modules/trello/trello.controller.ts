import { Request, Response } from "express";
import { Body } from "../../types";
import { BOARD_COLUMNS } from "../../constants";
import { TrelloService } from "./trello.service";

export const TrelloController = {
  formComplete: async (req: Request, res: Response) => {
    const id = req.params.id;
    await TrelloService.changeColumn(id, BOARD_COLUMNS[2].id);

    res.status(200).send("Form enviado com sucesso!");
  },

  agreeDoc: async (req: Request, res: Response) => {
    const id = req.params.id;

    const card = await TrelloService.getCardById(id);

    if (card.idList === BOARD_COLUMNS[4].id) {
      await TrelloService.changeColumn(id, BOARD_COLUMNS[5].id);
    } else {
      await TrelloService.changeColumn(id, BOARD_COLUMNS[4].id);
    }

    res.status(200).send(`${card.name} - Documento revisado com sucesso!`);
  },

  rejectDoc: async (req: Request, res: Response) => {
    const id = req.params.id;
    await TrelloService.changeColumn(id, BOARD_COLUMNS[2].id);

    res.status(200).send("Documento rejeitado!");
  },

  webhook: async (req: Request<null, null, Body>, res: Response) => {
    const body = req.body;

    if (body.action.data.old?.idList) {
      switch (body.action.data.card?.idList) {
        case BOARD_COLUMNS[1].id:
          await TrelloService.sendFormEmail(body);
          break;

        case BOARD_COLUMNS[3].id:
          await TrelloService.sendAgreeEmail(body);
          break;

        case BOARD_COLUMNS[4].id:
          await TrelloService.sendAgreeEmail(body, true);
          break;

        case BOARD_COLUMNS[5].id:
          await TrelloService.sendSubscriptionEmail(body);
          break;
      }
    }

    res.status(200).send();
  },
};
