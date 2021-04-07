// Import the express package
const express = require("express");
// Importing the body parser package
const bodyParser = require("body-parser");
// Import the dotenv package
const dotenv = require("dotenv");
// Import the express-graphql package
const { graphqlHTTP } = require("express-graphql");
// Importing the mongoose package
const mongoose = require("mongoose");
// Retriving the Schema from the schema folder
const graphQlSchema = require("./graphql/schema/index");
// Retrieving the Resolvers from the resolver
const graphQlresolvers = require("./graphql/resolver/index");
// to use the .env file in the server
dotenv.config();
// making the instance of server app using the express
const app = express();
// using the bodyparser
app.use(bodyParser.json());

// Middleware "/graphql" is an endpoint (only one endpoint)
app.use(
  "/graphql",
  graphqlHTTP({
    // using the graphql schema
    schema: graphQlSchema,
    // using the graphql resolvers
    rootValue: graphQlresolvers,
    // to enable the graphical interface in browser at localhost
    // http://localhost:8000/graphql
    graphiql: true,
  })
);
// url of mongo db
const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.hhaiv.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
// Connect the mongoose sevrice to the url
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(":) MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// A get Api point
app.get("/", (req, res) => {
  res.send("A GraphQL API");
});
// listeing on the port 8000
const port = process.env.PORT;
app.listen(port, () => {
  console.log(":) Server Connected Successfully ");
});
