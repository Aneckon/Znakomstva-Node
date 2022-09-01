const {Message} = require('../models/models')

class MessageController{
    async addMessage(req, res){
        const {message} = req.body
        const data = await Message.create({message, sender: from})
        return res.json(data)
    }

    async getMessage(req, res){

    }
}

module.exports = new MessageController()