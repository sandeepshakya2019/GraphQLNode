const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
dotenv.config();

const app = express();

app.use(bodyParser.json());

// Middleware "/graphql" is an endpoint (only one endpoint)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery{
            events:[String!]!
        }
        type RootMutation{
            createEvent(name:String):String
        }

        schema{
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
      // Resolvers same name as query and mutation
      events: () => {
        return ["Cooking", "Seelling", "Coding"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Sandeep Shakya");
});
const port = process.env.PORT;

app.listen(port, () => {
  console.log(":) Server Connect Successfully ");
});
