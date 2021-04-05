const express = require("express");
const bodyParser = require("body-parser");
// const graphqlHttp = require("express-graphql");
// const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

//Middleware "/graphql" is an endpoint (only one endpoint)
// app.use(
//   "/graphql",
//   graphqlHttp({
//     schema: buildSchema(`
//         schema{
//             query:,
//             mutation:
//         }
//     `),
//     rootValue: {},
//   })
// );
app.listen(8000, () => {
  console.log(":) Server Connect Successfully ");
});
