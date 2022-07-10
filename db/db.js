const User = require('../api/model/user');

const findUser = async (user) => {
return await User.find(user).exec()
}

const saveUser = async (newUser) => {
return await newUser.save();
};

module.exports = {findUser, saveUser};