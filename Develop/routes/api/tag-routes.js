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
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    res.status(200).json(tagData);
  }catch(err){
    res.status(500).json(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create(req.body)
    res.status(200).json(tagData)
  }catch(err){
    res.status(500).json(err)
  }
  // create a new tag
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
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id)
    await Tag.destroy({
      where: {
        id: req.params.id
      },
      attributes: {
        include: [
          await ProductTag.destroy({
            where: {
              tag_id: req.params.id,
            }
          })
        ]
      }
    })
    if (!tagData){
      res.status(404).json({message: 'No Tag with that ID found'});
      return;
    }
    res.status(200).json({message: `Tag with ID ${req.params.id} deleted`})
  }catch(err){
    res.status(500).json(err);
  }
  // delete on tag by its `id` value
});

module.exports = router;
