const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint


// returns json of all categories, with any products that are associated with them
router.get('/', async (req, res) => {
  try{
    const categoryData = await Category.findAll({
      include: [{ model: Product}]
    });
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});


// returns json of an individual category, with any products that are associated with it
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]  
    });
    if (!categoryData){
      return res.status(404).json({message: 'No Category with that ID found'})
    }
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});


// Creates new category with provided user specification
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err);
  }
});

// Modifies existing specified category with update data
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
      individualHooks: true
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category with this ID found'});
      return;
    }
    res.status(200).json(categoryData);
  }catch(err){
    res.status(500).json(err);
  }
});

// Deletes the specified category
router.delete('/:id', async (req, res) => {
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!categoryData) {
      res.status(404).json({ message: 'No Category with that ID found'});
      return;
    }
    res.status(200).json(`${req.params.id} has been deleted`);
  } catch(err) {
    res.status(500).json(`${err}  You cannot delete a Category if there are products still associated with it`);
  }
});

module.exports = router;
