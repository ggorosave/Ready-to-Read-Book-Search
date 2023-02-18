const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        
        // find a single user
        user: async (parent, { userId }) => {
            return User.findOne({ _id: userId }).populate('savedBooks');
        },

        // find me
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {

        // add a user and assign token
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        // finds user and assigns a token
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (!user) {
                throw new AuthenticationError('No user with this username or email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, profile }
        },

        addSavedBook: async (parent, { userId, savedBook }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $addToSet: { savedBooks: savedBook }
                    },
                    { new: true }
                )
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        removeSavedBook: async (parent, { savedBook }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: savedBook } },
                    { new: true }
                );
            }

            throw new AuthenticationError('You need to be logged in!');
        }

    }
};

module.exports = resolvers;