//Importar los requires
//
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const conf = require('../config/db_conf');


//User Shcema

const UserSchema = mongoose.Schema({
    name:{
        type: String
    },
    rango:{
        type: String
    },
    nnodo: {
        type: String,
        required: true
    },
    avatar:{
        type:String
    },
    email:{
        type: String,
    },
    username:{
        type: String
    },
    password:{
        type: String,
        required: true
    }
});

// hash the password before the user is saved
UserSchema.pre('save', function (next) {
	var user = this;
	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err);
		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// UserSchema.pre('update', function (next) {
//     var user = this;
//     console.log('weqeqweqweqweq   ',user.password)
//     // hash the password only if the password has been changed or user is new
//     if (!user.isModified('password')) return next();

//     // generate the hash
//     bcrypt.hash(user.password, null, null, function (err, hash) {
//         if (err) return next(err);
//         // change the password to the hashed version
//         user.password = hash;
//         next();
//     });
// });

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

const User = module.exports = mongoose.model('User',UserSchema);

//Function for a model logic

//byID
module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

//byUsername
module.exports.getUserByUsername = function(username,callback){
    const query = {username: username}
    User.findOne(query,callback);
}

//Add User
module.exports.addUser = function(newUser){
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err)throw err;
            newUser.password = hash;
            newUser.save();
        });
    });
}

//Compare Password
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err)throw err;
        callback(null,isMatch);
    });
}
