const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    images: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING, required: true},
    birthday: {type: DataTypes.STRING, required: true},
    gender: {type: DataTypes.STRING, required: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    height: {type: DataTypes.FLOAT},
    weight: {type: DataTypes.FLOAT},
    hairColor: {type: DataTypes.STRING},
    eyeColor: {type: DataTypes.STRING},
    datePurpose: {type: DataTypes.STRING},
    aboutMyself: {type: DataTypes.TEXT},
    likesAmount: {type: DataTypes.INTEGER, defaultValue: 0, validate: {min: 0}},
    mainProfilePicture: {type: DataTypes.STRING}
})


const Token = sequelize.define('token', {
    refreshToken: {type: DataTypes.STRING, required: true}
})

const Message = sequelize.define('message', {
    message: {type: DataTypes.STRING},

})


User.hasOne(Token)
Token.belongsTo(User)


User.hasOne(Message, {as: 'sender'})
Message.belongsTo(User)


module.exports = {
    User, Token, Message
}