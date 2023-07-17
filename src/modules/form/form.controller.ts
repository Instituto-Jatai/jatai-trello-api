import { Request, Response } from "express";
import config from "../../config";

export const FormController = {
  openForm: async (req: Request, res: Response) => {
    const id = req.params.id;

    res.status(200).send(`
        <html>
          <head>
            <title>Formulário</title>
          </head>
          <body>
            <h1>Formulário</h1>
            <form action="${config.apiUrl}/form-complete/${id}" method="POST">
              <label for="name">Nome:</label>
              <input type="text" id="name" name="name" required>
              <br>
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
              <br>
              <input type="submit" value="Enviar">
            </form>
          </body>
        </html>
    `);
  },
};
