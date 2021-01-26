module.exports = (sequelize, Sequelize) => {
  const HistoryTransaction = sequelize.define('HistoryTransaction', {
    id: {
      type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true
    },
    timeIn: { type: 'TIMESTAMP', allowNull: false },
    timeOut: { type: 'TIMESTAMP' },
    userNote: { type: Sequelize.STRING },
    systemNote: { type: Sequelize.STRING },
    selectedRoomID: { type: Sequelize.STRING, allowNull: false },
    usedItems: { type: Sequelize.STRING },
    sectionType: { type: Sequelize.STRING, allowNull: false },
    sectionRoomType: { type: Sequelize.STRING },
    cmndImg: { type: Sequelize.STRING },
    status: { type: Sequelize.INTEGER },
    totalCost: { type: Sequelize.INTEGER },
    totalSubtractedCost: { type: Sequelize.INTEGER },
    createdBy: { type: Sequelize.STRING },
    createdAt: { type: 'TIMESTAMP' },
    updatedBy: { type: Sequelize.STRING },
    updatedAt: { type: 'TIMESTAMP' }
  });
  return HistoryTransaction;
};
