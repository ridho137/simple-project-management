const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { User } = require('../models');

class UserController {
  static async register(req, res) {
    try {
      const { email, password, username } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (user){
        return res.status(500 ).json({error:500, message:`User with email ${email} already used`});
      }
      const query = await User.create({
        email,
        password,
        username,
      });
      const response = {
        id: query.id,
        username: query.username,
        email: query.email,
      };
      res.status(201).json(response);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw {
          name: 'User Login Error',
          message: `User with email ${email} not found`,
        };
      }
      const isCorrect = comparePassword(password, user.password);
      if (!isCorrect) {
        throw {
          name: 'User Login Error',
          message: `User password with email ${email} does not match`,
        };
      }
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = generateToken(payload);
      return res.status(200).json({
        token,
      });
    } catch (err) {
      return res.status(401).json(err);
    }
  }
}

module.exports = UserController;
