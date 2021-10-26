const graphql = require('graphql');
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLInt } = graphql;
const model = require('../models/model');
const resolver = require('../resolvers/resolver');

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        status: {
            type: GraphQLString,
            resolve: resolver.status
        },
        getAllUsers: {
            type: new GraphQLList(model.UserType),
            resolve: resolver.getAllUsers
        },
        getUser: {
            type: model.UserType,
            args: {
                id: { type: GraphQLInt },
                first_name: { type: GraphQLString }
            },
            resolve: resolver.getUser
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: model.UserType,
            args: {
                first_name: { type: new GraphQLNonNull(GraphQLString) },
                last_name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: resolver.createUser
        }
    }
});

const Subscription = new GraphQLObjectType({
    name: 'Subscription',
    fields: {
        newUser: {
            type: model.UserType,
            subscribe: resolver.newUser
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
    subscription: Subscription
});