const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
dotenv.config();

const app = express();

app.use(bodyParser.json());

const events = [];
// Middleware "/graphql" is an endpoint (only one endpoint)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type RootQuery{
            events:[Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput):Event
        }

        schema{
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
      // Resolvers same name as query and mutation
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random.toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
          //   date: new Date().toISOString(),
        };
        events.push(event);
        return event;
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
