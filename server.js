const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema/index");
const graphQlresolvers = require("./graphql/resolver/index");

dotenv.config();
const app = express();
app.use(bodyParser.json());

// const events = [];
// Middleware "/graphql" is an endpoint (only one endpoint)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlresolvers,
    graphiql: true,
  })
);

const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.hhaiv.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(":) Mongo Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("A GraphQL API");
});
const port = process.env.PORT;

app.listen(port, () => {
  console.log(":) Server Connect Successfully ");
});
