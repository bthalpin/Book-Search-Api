const { AuthenticationError } = require('apollo-server-express');
const { User} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    myProfile: async (parent, args, context) => {
      console.log(context.user)
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log('here',username,email,password)
      const user = await User.create({ username, email, password });
      console.log(user)
      const token = signToken(user);
      console.log(token,user)
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      console.log(email, password,'login')
      const user = await User.findOne({ email });
      console.log(user)
      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      console.log(user,token,'END LOGIN')
      return { token, user };
    },
    saveBook: async (parent, {authors,description,bookId,image,link,title}, context) => {
      console.log('logged',context.user,bookId,authors, typeof authors)
      // const bookData={...args}
      // console.log(bookData.authors,'HEEEEETTTTTTTTTEEEEE',args)
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: {description,bookId,image,link,title}
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
    deleteBook: async (parent, { bookId }, context) => {
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
