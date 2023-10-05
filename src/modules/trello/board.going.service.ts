import { BOARD_GOING_COLUMNS, GOING_CHECKLISTS } from "../../constants";
import { ChecklistItem } from "../../types";
import { EmailService } from "../email/email.service";
import { BOARD_GOING_FINISH_COLUMN } from "../email/templates/board-going-finish-column";
import { TrelloService } from "./trello.service";

export const BoardGoingService = {
  handleBoardGoingSecondColumn: async (
    cardId: string,
    oldListId: string
  ): Promise<void> => {
    try {
      if (oldListId === BOARD_GOING_COLUMNS[0].id) {
        await TrelloService.createChecklistWithItems(
          cardId,
          GOING_CHECKLISTS.secondColumn.name,
          GOING_CHECKLISTS.secondColumn.items
        );
      } else if (
        oldListId !== BOARD_GOING_COLUMNS[4].id &&
        oldListId !== BOARD_GOING_COLUMNS[5].id
      ) {
        const hasIncompleteItemsInCurrentChecklists =
          await TrelloService.hasIncompleteItemsInChecklists(
            cardId,
            GOING_CHECKLISTS.secondColumn.name
          );
        if (!hasIncompleteItemsInCurrentChecklists) {
          await TrelloService.changeColumn(cardId, oldListId);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  handleBoardGoingThirdColumn: async (
    cardId: string,
    oldListId: string,
    emails: string[],
    contactLink: string
  ): Promise<void> => {
    try {
      if (
        oldListId === BOARD_GOING_COLUMNS[0].id ||
        oldListId === BOARD_GOING_COLUMNS[1].id
      ) {
        const checklistFromSecondColumn =
          await TrelloService.getChecklistFromCardByName(
            cardId,
            GOING_CHECKLISTS.secondColumn.name
          );

        if (
          checklistFromSecondColumn &&
          checklistFromSecondColumn.checkItems.some(
            (item: ChecklistItem) => item.state === "incomplete"
          )
        ) {
          await TrelloService.changeColumn(cardId, oldListId);
        } else {
          await TrelloService.createChecklistWithItems(
            cardId,
            GOING_CHECKLISTS.thirdColumn.name,
            GOING_CHECKLISTS.thirdColumn.items
          );

          if (checklistFromSecondColumn?.id) {
            await EmailService.send(
              "Jataí - Execução da Compra",
              BOARD_GOING_FINISH_COLUMN({
                step: BOARD_GOING_COLUMNS[1].name,
                contactLink,
              }),
              emails
            );
          }
        }
      } else if (
        oldListId !== BOARD_GOING_COLUMNS[4].id &&
        oldListId !== BOARD_GOING_COLUMNS[5].id
      ) {
        const hasIncompleteItemsInCurrentChecklists =
          await TrelloService.hasIncompleteItemsInChecklists(
            cardId,
            GOING_CHECKLISTS.thirdColumn.name
          );
        if (!hasIncompleteItemsInCurrentChecklists) {
          await TrelloService.changeColumn(cardId, oldListId);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  handleBoardGoingFourthColumn: async (
    cardId: string,
    oldListId: string,
    emails: string[],
    contactLink: string
  ): Promise<void> => {
    try {
      if (
        oldListId === BOARD_GOING_COLUMNS[0].id ||
        oldListId === BOARD_GOING_COLUMNS[1].id ||
        oldListId === BOARD_GOING_COLUMNS[2].id
      ) {
        const checklistFromSecondColumn =
          await TrelloService.getChecklistFromCardByName(
            cardId,
            GOING_CHECKLISTS.secondColumn.name
          );
        const checklistFromThirdColumn =
          await TrelloService.getChecklistFromCardByName(
            cardId,
            GOING_CHECKLISTS.thirdColumn.name
          );

        if (
          (checklistFromSecondColumn &&
            checklistFromSecondColumn.checkItems.some(
              (item: ChecklistItem) => item.state === "incomplete"
            )) ||
          (checklistFromThirdColumn &&
            checklistFromThirdColumn.checkItems.some(
              (item: ChecklistItem) => item.state === "incomplete"
            ))
        ) {
          await TrelloService.changeColumn(cardId, oldListId);
        } else {
          await TrelloService.createChecklistWithItems(
            cardId,
            GOING_CHECKLISTS.fourthColumn.name,
            GOING_CHECKLISTS.fourthColumn.items
          );

          if (checklistFromThirdColumn?.id) {
            await EmailService.send(
              "Jataí - Execução da Compra",
              BOARD_GOING_FINISH_COLUMN({
                step: BOARD_GOING_COLUMNS[2].name,
                contactLink,
              }),
              emails
            );
          } else if (checklistFromSecondColumn?.id) {
            await EmailService.send(
              "Jataí - Execução da Compra",
              BOARD_GOING_FINISH_COLUMN({
                step: BOARD_GOING_COLUMNS[1].name,
                contactLink,
              }),
              emails
            );
          }
        }
      } else {
        const hasIncompleteItemsInCurrentChecklists =
          await TrelloService.hasIncompleteItemsInChecklists(
            cardId,
            GOING_CHECKLISTS.fourthColumn.name
          );
        if (!hasIncompleteItemsInCurrentChecklists) {
          await TrelloService.changeColumn(cardId, oldListId);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  handleBoardGoingFifthColumn: async (
    cardId: string,
    oldListId: string,
    emails: string[],
    contactLink: string
  ): Promise<void> => {
    try {
      if (oldListId === BOARD_GOING_COLUMNS[3].id) {
        const checklistFromFourthColumn =
          await TrelloService.getChecklistFromCardByName(
            cardId,
            GOING_CHECKLISTS.fourthColumn.name
          );

        if (
          checklistFromFourthColumn &&
          checklistFromFourthColumn.checkItems.some(
            (item: ChecklistItem) => item.state === "incomplete"
          )
        ) {
          await TrelloService.changeColumn(cardId, oldListId);
        } else {
          await TrelloService.createChecklistWithItems(
            cardId,
            GOING_CHECKLISTS.fifthColumn.name,
            GOING_CHECKLISTS.fifthColumn.items
          );

          if (checklistFromFourthColumn?.id) {
            await EmailService.send(
              "Jataí - Execução da Compra",
              BOARD_GOING_FINISH_COLUMN({
                step: BOARD_GOING_COLUMNS[3].name,
                contactLink,
              }),
              emails
            );
          }
        }
      } else {
        const hasIncompleteItemsInCurrentChecklists =
          await TrelloService.hasIncompleteItemsInChecklists(
            cardId,
            GOING_CHECKLISTS.fifthColumn.name
          );
        if (!hasIncompleteItemsInCurrentChecklists) {
          await TrelloService.changeColumn(cardId, oldListId);
        }
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  handleBoardGoingFSixthColumn: async (
    cardId: string,
    oldListId: string,
    emails: string[],
    contactLink: string
  ): Promise<void> => {
    try {
      if (oldListId === BOARD_GOING_COLUMNS[4].id) {
        const hasIncompleteItemsInChecklists =
          await TrelloService.hasIncompleteItemsInChecklists(
            cardId,
            GOING_CHECKLISTS.fifthColumn.name
          );

        if (hasIncompleteItemsInChecklists) {
          await TrelloService.changeColumn(cardId, oldListId);
        } else {
          await EmailService.send(
            "Jataí - Execução da Compra",
            BOARD_GOING_FINISH_COLUMN({
              step: BOARD_GOING_COLUMNS[4].name,
              contactLink,
            }),
            emails
          );
        }
      } else {
        await TrelloService.changeColumn(cardId, oldListId);
      }
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },
};
