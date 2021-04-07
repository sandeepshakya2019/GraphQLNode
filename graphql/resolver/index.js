const bcrypt = require("bcryptjs");
const Event = require("../../model/event");
const User = require("../../model/user");

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    })
    .catch((err) => {
      throw err;
    });
};
const user = (userId) => {
  return User.findById(userId)
    .then((user) => {
      return {
        ...user._doc,
        _id: user._doc._id.toString(),
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  // Resolvers same name as query and mutation
  events: () => {
    // return events;

    return Event.find()

      .then((events) => {
        // console.log(events);
        return events.map((event) => {
          // console.log(event._doc._id);
          //6:17#7
          return {
            ...event._doc,
            _id: event._doc._id.toString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  // Create Event Resolver or Mutation
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "606d3e5c634a333c2c652474",
    });
    // events.push(event);
    let createdEvent;
    return event
      .save()
      .then((result) => {
        createdEvent = {
          ...result._doc,
          password: null,
          _id: result._doc._id.toString(),
          creator: user.bind(this, result._doc.creator),
        };
        return User.findById("606d3e5c634a333c2c652474")
          .then((user) => {
            if (!user) {
              throw new Error("User Not found");
            }
            user.createdEvents.push(event);
            return user
              .save()
              .then((result) => {
                return createdEvent;
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
        console.log("Done ");
        return { ...result._doc };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    // return event;
  },
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User Exist Already");
        } else {
          return bcrypt
            .hash(args.userInput.password, 12)
            .then((hashPassword) => {
              const user = new User({
                email: args.userInput.email,
                password: hashPassword,
              });
              return user
                .save()
                .then((result) => {
                  console.log("Done ");
                  return {
                    ...result._doc,
                    password: null,
                    _id: result._doc._id.toString(),
                  };
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              console.log(err);
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });
  },
};
