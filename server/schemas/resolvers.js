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
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new AuthenticationError('No user with this username or email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user}
        },

        // saves a searched book
        saveBook: async (parent, { userId, bookId, authors, title, description, image }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $addToSet: { savedBooks: {
                            bookId: bookId,
                            authors: authors,
                            title: title,
                            description: description,
                            image: image
                        } }
                    },
                    { new: true }
                )
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        
        // removes a saved book
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: {
                        bookId: bookId
                    } } },
                    { new: true }
                );
            }

            throw new AuthenticationError('You need to be logged in!');
        }

    }
};

module.exports = resolvers;