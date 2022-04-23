const { AuthenticationError } = require('apollo-server-express');
const { User} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  // Returns user information for the savedBooks page
  Query: {
    myProfile: async (parent, args, context) => {
      
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {

    // Creates user on signup
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      
      // Creates jwt
      const token = signToken(user);
      return { token, user };
    },

    // Verifies login
    login: async (parent, { email, password }) => {     
      const user = await User.findOne({ email });
      
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    // Saves bookinformation to user
    saveBook: async (parent, {authors,description,bookId,image,link,title}, context) => {
      
      // If logged in
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: {authors,description,bookId,image,link,title}
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Deletes book from user
    deleteBook: async (parent, { bookId }, context) => {

      // if logged in
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: {
                bookId: bookId,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
  },
};

module.exports = resolvers;
