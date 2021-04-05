const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// const graphqlHttp = require("express-graphql");
// const { buildSchema } = require("graphql");
dotenv.config();

const app = express();

app.use(bodyParser.json());

// Middleware "/graphql" is an endpoint (only one endpoint)
// app.use(
//   "/graphql",
//   graphqlHttp({
//     schema: buildSchema(`
//         type RootQuery{
//             event:[String!]!
//         }
//         type RootMutation{
//             createEvent(name:String):String
//         }

//         schema{
//             query: RootQuery,
//             mutation RootMutation:
//         }
//     `),
//     rootValue: {},
//   })
// );

app.get("/", (req, res) => {
  res.send("Sandeep Shakya");
});
const port = process.env.PORT;

app.listen(port, () => {
  console.log(":) Server Connect Successfully ");
});
