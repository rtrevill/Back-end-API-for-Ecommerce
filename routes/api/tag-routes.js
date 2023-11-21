const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try{
    const tagData = await Tag.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    if (!tagData){
      return res.status(404).json({message: 'No Tag with that ID can be found'})
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create(req.body)
    res.status(200).json(tagData)
  }catch(err){
    res.status(500).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try{
    const tagbody = await Tag.findByPk(req.params.id);
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!tagbody){
      res.status(404).json({message: 'No Tag with that id found'});
      return;
    }
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id)
    await Tag.destroy({
      where: {
        id: req.params.id
      },
    })
    if (!tagData){
      res.status(404).json({message: 'No Tag with that ID found'});
      return;
    }
    res.status(200).json({message: `Tag with ID ${req.params.id} deleted`})
  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
