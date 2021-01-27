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
  });
  return ServiceItem;
};
