// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'id',
}),
// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'id',
}),
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(ProductTag, {
  through: 'product_id',
}),
// Tags belongToMany Products (through ProductTag)
ProductTag.belongsToMany(Product, { 
  through: 'id',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
