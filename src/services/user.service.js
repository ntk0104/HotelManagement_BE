import bcrypt from 'bcrypt';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import models from '../models';
import { getSignedObject } from '../utils/jwt.util';

export default class UserService {
  // nên dùng async-await ở đây mà ko cần try catch vì nếu lỗi thì thằng intercept trong container sẽ handle giúp
  async create(data) {
    const { email } = data;
    const matchingUser = await models.User.findOne({ where: { email: email.toLowerCase() } });
    if (matchingUser) {
      throw ErrorCode.EXISTED_EMAIL;
    }
    // email available
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const params = {
      ...data,
      id: uuidv4(),
      salt,
      password: hashedPassword,
      createdBy: data.email,
    };
    const createdUser = await models.User.create(params);
    return {
      email: createdUser.email,
      createdBy: createdUser.createdBy,
      createdAt: createdUser.createdAt,
    };
  }

  async login(data) {
    const { email, password } = data;
    const matchingUser = await models.User.findOne({ where: { email: email.toLowerCase() } });
    if (!matchingUser) {
      throw ErrorCode.UNAUTHORIZED_EMAIL;
    }
    // email have existed in DB
    const userSalt = _.get(matchingUser, 'salt', '');
    const userType = _.get(matchingUser, 'userType', '');
    const userPw = _.get(matchingUser, 'password', '');
    const userID = _.get(matchingUser, 'id', '');
    const isDeletedUser = _.get(matchingUser, 'deleted', false);
    const hashedPassword = await bcrypt.hash(password, userSalt);
    if (!_.isEqual(userPw, hashedPassword)) {
      throw ErrorCode.UNAUTHORIZED_EMAIL_OR_PASSWORD;
    }
    const userData = getSignedObject({
      email: data.email.toLowerCase(),
      userType,
      userID,
      isDeletedUser
    });
    return {
      ...userData,
      userId: _.get(matchingUser, 'id', ''),
      userType
    };
  }
}
