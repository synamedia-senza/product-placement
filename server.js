const express = require("express");
const app = express();
const errorHandler = require('errorhandler');
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 8080;
const publicDir = process.argv[2] || __dirname + '/public';
const config = require("./config.json");
const { OpenAI } = require("openai");
const openai = new OpenAI({apiKey: config.OpenAIApiKey});

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandler({dumpExceptions: true, showStack: true}));

const server = app.listen(port, () => console.log("Product placement running on port " + port));

function generate(prompt) {
  console.log(prompt);
  return openai.images.generate({
    model: "dall-e-3", prompt, n: 1, size: "1792x1024"
  }).then((response) => {
    let url = response.data[0].url;
    console.log(url);
    return url;
  }).catch((error) => {
    console.log(error);
    return null;
  });
}

app.get("/generate", async (req, res) => {
  let src = await generate(req.query.q);
  res.status(200).json({src});
});



