const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order, Comment } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_51KCeq0Dfk83F0fzkUXRkfGjZlcovoUxBRmAnRMioagiu5FztdnBTGb0Kw48fyLcShCS547QfshSTLsfnrkHpShyE00eSqTrA3W');

const resolvers = {

  Query: {

    categories: async () => {
      return await Category.find();
    },

    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params).populate('category');
    },

    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },

    /* comment: async (parent, {productId}) =>{
      return await Comment.filter(item => productId === item.productId)
    }, */

    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
        console.log("**************User", user)
        return user;
      }

      throw new AuthenticationError('Not logged in');
    },

    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        console.log("********************",user.orders.id(_id));

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },

    
    comments: async (parent, args, context) => {
      if (context.user) {
        return await Comment.find();
      }

      throw new AuthenticationError("Not logged in");
    },


    checkout: async (parent, args, context) => {
      
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products});
      const line_items = [];

      const { products } = await order.populate('products').execPopulate();
      //console.log("products$$$$$$$$$$$", products)

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`]
        });
        /* console.log("productPrice@@@@@@@@@", (products[i].price).toFixed(2)) */
        
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: parseInt(products[i].price*100),
            currency: 'usd',
          });
          /* console.log("price#########", price) */
      
        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      })
      //console.log("session%%%%%%%%%%%%%%%%%", session)
      return { session: session.id };
    }catch(err){
        
        console.log(err)
      }
    }
  },


  Mutation: {

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    addComment: async (parent, args) => {
      const comment = await Comment.create(args);
      return comment;
    },

    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });
        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
        return order;
      }
      throw new AuthenticationError('Not logged in');
    },

    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }
      throw new AuthenticationError('Not logged in');
    },

    updateProduct: async (parent, { _id, quantity}) => {
      const decrement = Math.abs(quantity) * -1;
      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};

module.exports = resolvers;
