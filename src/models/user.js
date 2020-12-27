module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true
    },
    salt: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false, unique: true },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    userType: { type: Sequelize.STRING },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    phoneNumber: { type: Sequelize.STRING },
    dob: { type: Sequelize.DATE },
    profileImage: { type: Sequelize.BLOB },
    address: { type: Sequelize.STRING },
    isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    isPhoneVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdBy: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE },
    updatedBy: { type: Sequelize.STRING },
    updatedAt: { type: Sequelize.DATE },
  });
  return User;
};
