// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Defining associations between models. These are reliant on primary keys and foreign keys to link the models, as specified below.

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// Products belongToMany Tags (through ProductTag)
// OnDelete: CASCADE will remove the association from the ProductTag model if a tag is deleted
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  onDelete: 'CASCADE',
});

// Tags belongToMany Products (through ProductTag)
// OnDelete: CASCADE will remove the association from the ProductTag model if a product is deleted
Tag.belongsToMany(Product, { 
  through: ProductTag,
  foreignKey: 'tag_id',
  onDelete: 'CASCADE',
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
