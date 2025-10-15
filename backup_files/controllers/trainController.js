const db = require('../models');
const { Train } = db;

// Generate train ID
const generateTrainId = async () => {
  const trainCount = await Train.count();
  return `TRN${String(trainCount + 1).padStart(3, '0')}`;
};

// Get all trains
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.findAll({
      order: [['train_id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: trains.length,
      data: { trains }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trains',
      error: error.message
    });
  }
};

// Get train by ID
const getTrainById = async (req, res) => {
  try {
    const { id } = req.params;

    const train = await Train.findByPk(id);

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { train }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching train',
      error: error.message
    });
  }
};

// Create new train
const createTrain = async (req, res) => {
  try {
    const { capacity, notes } = req.body;

    // Generate train ID
    const train_id = await generateTrainId();

    // Create new train
    const train = await Train.create({
      train_id,
      capacity,
      notes: notes || null
    });

    res.status(201).json({
      success: true,
      message: 'Train created successfully',
      data: { train }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating train',
      error: error.message
    });
  }
};

// Update train
const updateTrain = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, notes } = req.body;

    // Find train
    const train = await Train.findByPk(id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    // Update train
    await train.update({
      capacity: capacity !== undefined ? capacity : train.capacity,
      notes: notes !== undefined ? notes : train.notes
    });

    res.status(200).json({
      success: true,
      message: 'Train updated successfully',
      data: { train }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating train',
      error: error.message
    });
  }
};

// Delete train
const deleteTrain = async (req, res) => {
  try {
    const { id } = req.params;

    const train = await Train.findByPk(id);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    await train.destroy();

    res.status(200).json({
      success: true,
      message: 'Train deleted successfully'
    });
  } catch (error) {
    // Check if error is due to foreign key constraint
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete train as it is referenced in train trips'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting train',
      error: error.message
    });
  }
};

// Get trains by capacity range
const getTrainsByCapacity = async (req, res) => {
  try {
    const { minCapacity, maxCapacity } = req.query;

    const whereClause = {};
    
    if (minCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.gte]: minCapacity };
    }
    
    if (maxCapacity) {
      whereClause.capacity = { ...whereClause.capacity, [db.Sequelize.Op.lte]: maxCapacity };
    }

    const trains = await Train.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      order: [['capacity', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: trains.length,
      data: { trains }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trains',
      error: error.message
    });
  }
};

module.exports = {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  getTrainsByCapacity
};
