import express, { Request, Response } from "express";
import db from "./database/knex";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.post || 8000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get("/", (req: Request, res: Response) => {
  console.log("Root route visited");
  res.send("Hello, World!");
});

app.get("/check", async (req: Request, res: Response) => {
  try {
    const pollingUnits = await db("polling_unit").select("*");
    // res.json(check);
    res.render('index', { pollingUnits });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/polling-with-result", async (req: Request, res: Response) => {
  try {
    const result = await db("polling_unit")
      .join(
        "announced_pu_results",
        "uniqueid",
        "=",
        "announced_pu_results.polling_unit_uniqueid"
      )
      .select("*");
      console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching polling-with-result" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
