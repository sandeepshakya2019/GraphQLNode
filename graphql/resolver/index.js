const bcrypt = require("bcryptjs");
const Event = require("../../model/event");
const User = require("../../model/user");
const Booking = require("../../model/booking");

const events = (eventIds) => {
  return Event.find({ _id: { $in: eventIds } })
    .then((events) => {
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event._doc._id.toString(),
          date: new Date(event._doc.date).toISOString(),
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
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator),
          };
        });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  booking: () => {
    return Booking.find()
      .then((bookings) => {
        return bookings.map((booking) => {
          return {
            ...booking._doc,
            _id: booking._doc._id.toString(),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  // Create Event Resolver or Mutation
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "606d62fe55477729604e3a0f",
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
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator),
        };
        return User.findById("606d62fe55477729604e3a0f")
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
  bookEvent: (args) => {
    return Event.findOne({ _id: args.eventId })
      .then((fetchedEvent) => {
        const booking = new Booking({
          user: "606d3fa1b1ebb52f701cfb96",
          event: fetchedEvent,
        });
        return booking
          .save()
          .then((result) => {
            return {
              ...result._doc,
              _id: result.id,
              createdAt: new Date(result._doc.createdAt).toISOString(),
              updatedAt: new Date(result._doc.updatedAt).toISOString(),
            };
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  },
};
