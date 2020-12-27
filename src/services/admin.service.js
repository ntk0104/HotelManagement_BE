import models from '../models';

export default class AdminService {
  // nên dùng async-await ở đây mà ko cần try catch vì nếu lỗi thì thằng intercept trong container sẽ handle giúp
  async getUsers() {
    const listUsers = await models.User.findAll();
    return listUsers.map((user) => {
      const {
        id, email, userType, firstName, lastName, phoneNumber, profileImage
      } = user;
      return {
        id, email, userType, firstName, lastName, phoneNumber, profileImage
      };
    });
  }
}
