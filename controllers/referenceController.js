const Reference = require('../models/reference');

exports.getReferences = async (req, res) => {
  try {
    const references = await Reference.findAll({ order: [['name', 'ASC']] });
    res.json(references);
  } catch (error) {
    console.error('Error fetching references:', error);
    res.status(500).json({ error: 'DB error' });
  }
};

exports.addReferences = async (req, res) => {
  const { name, code, type } = req.body;

  if (!name || !code || !type) {
    return res.status(400).json({ error: 'Name, code, and type are required' });
  }

  try {
    const newRef = await Reference.create({ name, code, type });
    res.status(201).json({ message: 'Reference added successfully', id: newRef.id });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Code already exists' });
    }
    console.error('Error adding reference:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deleteReference = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Reference ID is required' });

  try {
    const result = await Reference.destroy({ where: { id } });
    if (!result) return res.status(404).json({ error: 'Reference not found' });

    res.status(200).json({ message: 'Reference deleted successfully' });
  } catch (error) {
    console.error('Error deleting reference:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateReference = async (req, res) => {
  const { id } = req.params;
  const { name, code, type } = req.body;

  if (!id || !name || !code || !type) {
    return res.status(400).json({ error: 'ID, name, code, and type are required' });
  }

  try {
    const [updatedRows] = await Reference.update({ name, code, type }, { where: { id } });
    if (updatedRows === 0) return res.status(404).json({ error: 'Reference not found' });

    res.status(200).json({ message: 'Reference updated successfully' });
  } catch (error) {
    console.error('Error updating reference:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
