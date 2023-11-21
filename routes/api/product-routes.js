const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// return a json of all products in the database
// along with any associated categories and products for each product.
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category}, {model: Tag}]
    });
    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
  }
});

// return a json of one specified product from the database
// along with any associated categories and products for that product.
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model: Tag}]
    });
    if (!productData){
      res.status(404).json({message: 'No product with that ID found'})
      return;
    }
    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
  }
});

// Creates a new product from the specified user data.
// This also creates associations in ProductTag with any tags that have been specified.
router.post('/', async (req, res) => {
  await Product.create(req.body)
    .then(async (product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = await req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// Modifies a specified product with the provided user data.
// Also assesses if there are to be any changes to associations with tags in ProductTags
// and then performs those modifications
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


// Removes a specified product from the database
router.delete('/:id', async (req, res) => {
  try{
  const productData = await Product.destroy({
    where : {
      id: req.params.id,
    },
  })
  if (!productData){
    res.status(404).json({message: 'No product with that ID can be found'});
    return;
  };
  res.status(200).json(`${req.params.id} has been deleted`);
  }catch(err){
    res.status(500).json(err);
  };
});

module.exports = router;
