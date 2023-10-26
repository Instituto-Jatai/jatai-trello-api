import { Application, Request, Response } from "express";
import packageJson from "../package.json";
import { TrelloController } from "./modules/trello/trello.controller";
import { FormController } from "./modules/form/form.controller";

const Routes = {
  setupRoutes: (app: Application): void => {
    app.get("/", (req: Request, res: Response) => {
      console.log("GET");
      res.send(`Jatai API v${packageJson?.version} is running.`);
    });

    app.head("/", TrelloController.headOk);

    app.head("/going", TrelloController.headOk);

    app.post("/", TrelloController.webhookDocuments);

    app.post("/going", TrelloController.webhookGoing);

    app.get("/form/:id", FormController.openForm);

    app.get("/:cardId/to/:newColumnId", TrelloController.toNewColumn);

    app.get("/:cardId/:checklistId/approve/:email", TrelloController.approve);

    app.get("/test-schedule", TrelloController.testSchedule);

    app.get("/test-resume", TrelloController.testResume);

    app.all(
      "*",
      (_req: Request, res: Response): Response =>
        res.status(404).send({ error: 404, message: "Check your URL please" }),
    );
  },
};

export default Routes;
