const db = require('./connection');
const { User, Product, Category } = require('../models');

db.once('open', async () =>
{
  await Category.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Birthday Cake' },
    { name: 'Chocolate Cake' },
    { name: 'Christmas Cake' },
    { name: 'Fruit Cake' },

  ]);

  console.log('categories seeded');

  await Product.deleteMany();

  const products = await Product.insertMany([
    {
      name: 'A',
      description:
        'The cake flavor is vanilla cake and sprinkles mixed in. It is two dense layers of buttery, vanilla-forward white cake wrapped in classically rich buttercream frosting',
      image: 'birthday1.png',
      category: categories[0]._id,
      price: 20.99,
      quantity: 1
    },
    {
      name: 'B',
      description:
        'Three-layer white cake featuring delectable buttercream frosting & filling, festive confetti sprinkles, and an edible “Happy Birthday” sign on top. Arrives in an elegant gift box and includes a greeting card that you can personalize online. Decorate your cake with the name of your recipient by typing it in the Personalization field.',
      image: 'birthday2.png',
      category: categories[0]._id,
      price: 19.99,
      quantity: 1
    },
    {
      name: 'C',
      category: categories[1]._id,
      description:
        'Ideal for chocolate lovers! This decadent cake has rich layers of chocolate cake topped with dreamy chocolate icing. ',
      image: 'chocolate1.png',
      price: 17.99,
      quantity: 1
    },
    {
      name: 'D',
      category: categories[1]._id,
      description:
        'This decadent cake has rich layers of chocolate cake wrapped in classically rich chocolate frosting',
      image: 'chocolate2.png',
      price: 23.99,
      quantity: 1
    },
    {
      name: 'E',
      category: categories[1]._id,
      description:
        'Ideal for chocolate lovers! This decadent cake has rich layers of chocolate cake topped with dreamy chocolate icing. Arrives in an elegant gift box and includes a greeting card that you can personalize online. Decorate your cake with the name of your recipient by typing it in the Personalization field.',
      image: 'chocolate3.png',
      price: 14.99,
      quantity: 2
    },
    {
      name: 'F',
      category: categories[2]._id,
      description:
        'snow-white cake that is light and soft but still sturdy enough to stack or cover with fondant. It has an amazing flavor, a soft, cloud-like crumb, and is so incredibly moist and wrapped in classically rich buttercream frosting.',
      image: 'Christmas4.JPG',
      price: 19.99,
      quantity: 3
    },
    {
      name: 'G',
      category: categories[2]._id,
      description:
        'This gingerbread house is a novelty confectionery shaped like a building that is made of cookie dough, cut and baked into appropriate components like walls and roofing. It is covered with a variety of candies and icing. ',
      image: 'Christmas2.JPG',
      price: 19.99,
      quantity: 3
    },
    {
      name: 'H',
      category: categories[3]._id,
      description:
        'We believe the first word in “Fruit Cake” ought to be fruit! The legend began in Leipzig, Germany, where the best fruits and nuts of the harvest season were reserved for the moist, luscious cakes to be enjoyed at holiday feasts.',
      image: 'fruit1.png',
      price: 9.99,
      quantity: 1
    },
    {
      name: 'I',
      category: categories[3]._id,
      description: 'This Fruit Cake have Texas Pecans, glaceed cherries, tropical strawberry and golden raisins, baked in our buttery egg batter- a tasteful tradition everyone will love.',
      image: 'fruit2.png',
      price: 11.99,
      quantity: 1
    },
    {
      name: 'J',
      category: categories[3]._id,
      description:
        'Three-layer white cake with fresh fruits and nuts. Arrives in an elegant gift box and includes a greeting card that you can personalize online. Decorate your cake with the name of your recipient by typing it in the Personalization field.',
      image: 'fruit3.png',
      price: 12.99,
      quantity: 1
    },
    {
      name: 'K',
      category: categories[3]._id,
      description:
        'A rich butter cake contains fresh fruit and wrapped in classically rich buttercream frosting',
      image: 'fruit4.png',
      price: 17.99,
      quantity: 1
    },
    {
      name: 'L',
      category: categories[3]._id,
      description:
        'This Fruit Cake is bursting with soft and sweet berries that are sandwiched between a layer of white cake and a cinnamon flavored streusel.',
      image: 'fruit5.png',
      price: 19.99,
      quantity: 2
    }
  ]);

  console.log('products seeded');

  await User.deleteMany();

  await User.create({
    firstName: 'Jili',
    lastName: 'Jiang',
    email: 'jili@gmail.com',
    password: '12345',
    address: '123 Main Street, San Francisco, CA 91800',
    orders: [
      {
        products: [products[0]._id, products[0]._id, products[1]._id]
      }
    ]
  });



  console.log('users seeded');

  process.exit();
});
