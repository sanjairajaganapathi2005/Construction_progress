const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberType: { type: String, required: true , enum:['admin' , 'JuniorEngineer', 'AssistantEngineer','ExecutiveEngineer', 'ChiefEngineer'] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
