import express from "express";
import laborRouter from './routes/laborCostsRoutes.js';

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello!!");
});

app.use('/labor-costs', laborRouter)

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Listening on port ${port}`);
  })
}

export default app;