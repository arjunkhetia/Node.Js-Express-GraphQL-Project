const graphql = require("graphql");
const { GraphQLError } = graphql;
const userData = require("../MOCK_DATA.json");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const NEW_USER_EVENT = 'NEW_USER_EVENT';

const resolver = {
  status: (parent, args, context) => {
    return "GraphQL Server is running...";
  },
  getAllUsers: (parent, args, context) => {
    return userData;
  },
  getUser: (parent, args, context) => {
    const user = userData.filter((user) => {
      if (args.id <= 0) {
        throw new GraphQLError(
          "Validation: id must be greater then or equal to 1"
        );
      }
      if (args.id && args.id === user.id) {
        return user;
      }
      if (args.first_name && args.first_name === user.first_name) {
        return user;
      }
    });
    return user[0];
  },
  createUser: (parent, args, context) => {
    const user = {
      id: userData.length + 1,
      first_name: args.first_name,
      last_name: args.last_name,
      email: args.email,
      gender: args.gender,
    };
    userData.push(user);
    pubsub.publish(NEW_USER_EVENT, { newUser: user });
    return args;
  },
  newUser: (parent, args, context) => {
    return pubsub.asyncIterator(NEW_USER_EVENT);
  },
};

module.exports = resolver;
