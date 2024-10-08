const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verify = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return done(null, false, { usernameError: 'Incorrect username' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { passwordError: 'Incorrect password' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const strategy = new LocalStrategy(verify);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    done(null, user);
  } catch (err) {
    return done(err);
  }
});
