const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const jwtSecret = '7ujKa6ZZu0rtHtSrjbFu90pfw';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessions: [{
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    }
  }]
})

// *** Instance methods ***

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  //return the document exept the password and sessions (these shouldn't be made availabel)
  return _.omit(userObject, ['password', 'sessions'])
}

UserSchema.methods.generateAccessAuthToken = function() {
  const user = this;
  return new Promise((resolve, reject) => {
    jwt.sign({ _id: user._id.toHexString()}, jwtSecret, {expiresIn: "15m"}, (err, token) => {
      if(!err) {
        resolve(token);
      } else {
        reject();
      }
    })
  })
}

UserSchema.methods.generateRefreshAuthToken = function() {
  //Generate a 64byte hex string - it doesn't save in to database (saveSessiontoDatabase() does that)
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if(!err) {
        let token = buf.toString('hex');
        return resolve(token);
      }
    })
  })
}

UserSchema.methods.createSession = function() {
  let user = this;
  return user.generateRefreshAuthToken().then((refreshToken) => {
    return saveSessiontoDatabase(user, refreshToken);
  }).then((refreshToken) => {
    return refreshToken;
  }).catch((e) => {
    return Promise.reject('Failed to save session to database.\n' + e);
  })
}

//** MODEL METHODS

UserSchema.statics.findByIdAndToken = function(_id, token) {
  const User = this;

  return User.findOne({
    _id,
    'sessions.token': token
  })
}
UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then((user) => {
      if (!user) return Promise.reject();

      return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                  resolve(user);
              }
              else {
                  reject();
              }
          })
      })
  })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondSinceEpoch) {
    return false;
  } else {
    return true;
  }
}


//** MIDDLEWARE
//Before a user document is saved, this cod runs

UserSchema.pre('save', function(next) {
  let user = this;
  let costFactor = 10;

  if(user.isModified('password')) {
    // if the password field has been changed/edited then run this code

    // generate salt and hash password
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})

//** HELPER METHODS

let saveSessiontoDatabase = (user, refreshToken) => {
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    user.sessions.push({'token': refreshToken, expiresAt});

    user.save().then(() => {
      return resolve(refreshToken);
    }).catch((e) => {
      reject(e);
    })
  })
} 

let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = "10";
  let secondUntilexpire = ((daysUntilExpire * 24) * 60) * 60;
  return (Date.now() / 1000) + secondUntilexpire;
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };