module.exports = (sequelize, Sequelize) => {
  const ServiceItem = sequelize.define('ServiceItem', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    unitPrice: { type: Sequelize.INTEGER, allowNull: false },
    availableQuanity: { type: Sequelize.INTEGER },
    createdBy: { type: Sequelize.STRING },
    createdAt: { type: 'TIMESTAMP' },
    updatedBy: { type: Sequelize.STRING },
    updatedAt: { type: 'TIMESTAMP' },
    isDeleted: { type: Sequelize.BOOLEAN }
  });
  return ServiceItem;
};
