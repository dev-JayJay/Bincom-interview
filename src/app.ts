import express, { Request, Response } from "express";
import db from "./database/knex";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Lga from "./models/lga";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.post || 8000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// app.get("/", (req: Request, res: Response) => {
//   console.log("Root route visited");
//   res.send("Hello, World!");
// });

app.get("/", async (req: Request, res: Response) => {
  try {
    const pollingUnitsResult = await db("polling_unit")
      .join(
        "announced_pu_results",
        "uniqueid",
        "announced_pu_results.polling_unit_uniqueid"
      )
      .select("*")
      .where("uniqueid", 9);
    res.render('index', { pollingUnitsResult });
  } catch (error) {
    res.status(500).json({ message: "Error fetching polling unit result" });
  }
});

app.get("/lga-result", async (req: Request, res: Response) => {
  try {
    const lga_results = await Lga.query().withGraphFetched('polling_unit'); 
    // res.json(lga_results);
    res.render('lga', { lga_results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching polling-with-result" });
  }
});

app.get('/new-party-score', (req, res) => {
  res.render('form');
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.post('/new-party-score', async (req, res) => {
  const { polling_unit_uniqueid, party_abbreviation, party_score, entered_by_user, date_entered, user_ip_address } = req.body;

  try {
    const [insertedId] = await db('announced_pu_results').insert({
      polling_unit_uniqueid,
      party_abbreviation,
      party_score,
      entered_by_user,
      date_entered,
      user_ip_address,
    });

    res.send(`Data inserted successfully with ID: ${insertedId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
