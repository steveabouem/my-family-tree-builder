import express from'express';
import cors from 'cors';
const app = express();
app.use(cors());

app.get('/', (req, res, next) => {
  console.log('RECEIVED REQUEST');
  res.redirect("https://www.sportingnews.com/ca/nba?gr=www");
});

const port = 4000;
 app.listen(port, () => console.log(`Server running on port ${port}.`))