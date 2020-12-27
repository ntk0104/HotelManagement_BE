module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define('Room', {
    id: {
      type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true
    },
    roomName: { type: Sequelize.STRING, allowNull: false },
    roomType: { type: Sequelize.INTEGER, allowNull: false },
    overnightPrice: { type: Sequelize.INTEGER, allowNull: false },
    shorttimePrice_Fan: { type: Sequelize.INTEGER, allowNull: false },
    shorttimePrice_Air: { type: Sequelize.INTEGER, allowNull: false },
    status: { type: Sequelize.STRING, allowNull: false }
  });
  return Room;
};
