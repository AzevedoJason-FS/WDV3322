const User = require('../api/model/user');
const mongoose = require('mongoose');

const findUser = async (user) => {
return await User.find(user).exec()
}

const saveUser = async (newUser) => {
return await newUser.save();
};

const connect = async() => {
await mongoose.connect("mongodb://localhost:27017/users")
}

const disconnect = async() => {
await mongoose.connection.close();
}

module.exports = {findUser, saveUser, connect, disconnect};