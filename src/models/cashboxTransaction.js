module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('CashboxTransaction', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    type: { type: Sequelize.BOOLEAN },
    changedCash: { type: Sequelize.INTEGER },
    note: { type: Sequelize.STRING },
    isChecked: { type: Sequelize.BOOLEAN, defaultValue: false },
    baselineAmount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    createdBy: { type: Sequelize.STRING },
    createdAt: { type: 'TIMESTAMP' },
    updatedBy: { type: Sequelize.STRING },
    updatedAt: { type: 'TIMESTAMP' }
  });
  return User;
};
