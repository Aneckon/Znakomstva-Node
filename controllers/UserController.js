const { User, Token } = require('../models/models');
const bcrypt = require('bcrypt');
const path = require('path');
const uuid = require('uuid');
const TokenService = require('../services/TokenService');

class UserController {
  async registration(req, res) {
    const { email, password, name, birthday, gender } = req.body;
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.json({ error: 'пользователь с таким email уже существует' });
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const user = await User.create({ email, password: hashPassword, name, birthday, gender });
    const refreshToken = TokenService.generateJWT(user.id, user.email);
    const token = await Token.create({ refreshToken, userId: user.id });
    res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });
    return res.json(token);
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ error: 'такого пользователя не существует' });
    }
    let comparePassword = await bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.json({ error: 'неверный пароль' });
    }
    const refreshToken = TokenService.generateJWT(user.id, user.email);
    const token = await Token.create({ refreshToken, userId: user.id });
    res.cookie('refreshToken', refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(token);
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    const token = TokenService.removeJWT(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  async getAllUsers(req, res) {
    const users = await User.findAll();
    return res.json(users);
  }

  async getProfile(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });
    return res.json(user);
  }

  async addInfo(req, res) {
    const { id, images, height, weight, hairColor, eyeColor, datePurpose, aboutMyself } = req.body;
    const { mainProfilePicture } = req.files;
    let filename = uuid.v4() + '.jpg';
    mainProfilePicture.mv(path.resolve(__dirname, '..', 'static', filename));
    const user = await User.update(
      {
        images,
        height,
        weight,
        hairColor,
        eyeColor,
        datePurpose,
        aboutMyself,
        mainProfilePicture: filename,
      },
      { where: { id } },
    );
    return res.json(user);
  }

  async changeConfidence(req, res) {
    const { id, email, password } = req.body;
    const hashPass = await bcrypt.hash(password, 3);
    const user = await User.update({ email, password: hashPass }, { where: { id } });
    return res.json(user);
  }

  async delete(req, res) {
    const id = req.params.id;
    const user = await User.destroy({ where: { id } });
    return res.json(user);
  }

  async addLike(req, res) {
    const id = req.params.id;
    const user = await User.increment('likesAmount', { where: { id } });
    return res.json(user);
  }

  async removeLike(req, res) {
    const id = req.params.id;
    const user = await User.decrement('likesAmount', { where: { id } });
    return res.json(user);
  }
}

module.exports = new UserController();
