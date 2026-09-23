import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello Cortex");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});