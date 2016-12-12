module.exports = {
  'facebookAuth': {
    'clientID': process.env.FB_ID,
    'clientSecret': process.env.FB_SECRET,
    'callbackURL': 'http://localhost:8080/auth/facebook/callback'
  },

  'twitterAuth': {
    'consumerKey': process.env.TWITTER_KEY,
    'consumerSecret': process.env.TWITTER_SECRET,
    'callbackURL': 'http://localhost:8080/auth/twitter/callback'
  },

  'googleAuth': {
    'clientID': process.env.GOOGLE_ID,
    'clientSecret': process.env.GOOGLE_SECRET,
    'callbackURL': 'http://localhost:8080/auth/google/callback'
  },

  'twitchAuth': {
    'clientID': process.env.TWITCH_ID,
    'clientSecret': process.env.TWITCH_SECRET,
    'callbackURL': 'http://localhost:8080/auth/twitch/callback'
  }
}
