const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Train = sequelize.define('Train', {
    train_id: {
      type: DataTypes.STRING(40),
      primaryKey: true
    },
    capacity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
      validate: {
        min: { args: [0.0001], msg: 'Capacity must be greater than 0' }
      }
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'train'
  });

  // Define associations
  Train.associate = (models) => {
    // Can add associations later if needed
  };

  return Train;
};
