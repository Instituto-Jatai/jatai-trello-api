import axios from "axios";
import schedule from "node-schedule";
import { Card } from "./types";
import { BOARD_COLUMNS } from "./constants";
import config from "./config";
import { TrelloService } from "./modules/trello/trello.service";

export const startSchedule = () => {
  schedule.scheduleJob(
    { hour: 7, minute: 0, dayOfWeek: [1, 2, 3, 4, 5] },
    async () => {
      console.log("Is 07:00 AM!");

      const cardsWaitingMeet = (
        await axios.get<Card[]>(
          `${config.trello.apiUrl}/lists/${BOARD_COLUMNS[1].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
        )
      ).data;

      if (cardsWaitingMeet && cardsWaitingMeet.length > 0) {
        await Promise.all(
          cardsWaitingMeet.map((card) =>
            TrelloService.sendWaitMeetEmail(card.id)
          )
        );
      }

      const cardsWaitReviewEmail = (
        await axios.get<Card[]>(
          `${config.trello.apiUrl}/lists/${BOARD_COLUMNS[4].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
        )
      ).data;

      if (cardsWaitReviewEmail && cardsWaitReviewEmail.length > 0) {
        await Promise.all(
          cardsWaitReviewEmail.map((card) =>
            TrelloService.sendWaitReviewEmail(card.id)
          )
        );
      }

      const cardsWaitLeadReviewEmail = (
        await axios.get<Card[]>(
          `${config.trello.apiUrl}/lists/${BOARD_COLUMNS[6].id}/cards?key=${config.trello.key}&token=${config.trello.token}`
        )
      ).data;

      if (cardsWaitLeadReviewEmail && cardsWaitLeadReviewEmail.length > 0) {
        await Promise.all(
          cardsWaitLeadReviewEmail.map((card) =>
            TrelloService.sendWaitLeadReviewEmail(card.id)
          )
        );
      }
    }
  );
};
