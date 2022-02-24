const express = require("express");
const auth = require("./routes/auth");
const posts = require("./routes/posts");

const app = express();

app.use(express.json());

app.use("/auth", auth);
app.use("/posts", posts);


app.get("/", (req, res) => {
  res.send("Arushi Gandhi is on vacay");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
