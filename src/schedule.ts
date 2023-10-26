import axios from "axios";
import schedule from "node-schedule";
import { Card } from "./types";
import { BOARD_DOCUMENTS_COLUMNS } from "./constants";
import config from "./config";
import { BoardDocumentsService } from "./modules/trello/board.documents.service";
import { TrelloService } from "./modules/trello/trello.service";

export const startSchedule = () => {
  schedule.scheduleJob(
    { hour: 5, minute: 0, dayOfWeek: [1, 2, 3, 4, 5] },
    async () => {
      const cardsWaitingMeet = (
        await axios.get<Card[]>(
          `${config.trello.apiUrl}/lists/${BOARD_DOCUMENTS_COLUMNS[1].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
        )
      ).data;

      if (cardsWaitingMeet && cardsWaitingMeet.length > 0) {
        await Promise.all(
          cardsWaitingMeet.map((card) =>
            BoardDocumentsService.sendWaitMeetEmail(card.id)
          )
        );
      }

      await TrelloService.notifyDueChecklistItems();
    }
  );

  schedule.scheduleJob({ hour: 5, minute: 10, dayOfWeek: [2, 4] }, async () => {
    const cardsWaitReviewEmail = (
      await axios.get<Card[]>(
        `${config.trello.apiUrl}/lists/${BOARD_DOCUMENTS_COLUMNS[4].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;

    if (cardsWaitReviewEmail && cardsWaitReviewEmail.length > 0) {
      await Promise.all(
        cardsWaitReviewEmail.map((card) =>
          BoardDocumentsService.sendWaitReviewEmail(card.id)
        )
      );
    }

    const cardsWaitLeadReviewEmail = (
      await axios.get<Card[]>(
        `${config.trello.apiUrl}/lists/${BOARD_DOCUMENTS_COLUMNS[6].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
      )
    ).data;

    if (cardsWaitLeadReviewEmail && cardsWaitLeadReviewEmail.length > 0) {
      await Promise.all(
        cardsWaitLeadReviewEmail.map((card) =>
          BoardDocumentsService.sendWaitLeadReviewEmail(card.id)
        )
      );
    }
  });

  schedule.scheduleJob({ hour: 5, minute: 20, dayOfWeek: [1] }, async () => {
    await TrelloService.sendWeekResume();
  });
};
