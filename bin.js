#!/usr/bin/env node
var gitterBot = require('./')

function getIrcOpts () {
  var ircOpts = process.env['GITTERBOT_IRC_OPTS']

  if (ircOpts) {
    try {
      ircOpts = JSON.parse(process.env['GITTERBOT_IRC_OPTS'])
    } catch (err) {
      console.error('Invalid JSON in GITTERBOT_IRC_OPTS')
      process.exit(1)
    }
  }

  return ircOpts || {}
}

var opts = {
  ircServer: "irc.freenode.net",
  ircChannel: "#vimfest",
  ircNick: "vimfestbot",
  ircAdmin: "wikimatze",
  ircOpts: getIrcOpts(),
  gitterApiKey: "7e414e411a585b2e65a35de50f18c9d47b525a53",
  gitterRoom: "vimberlin/vimfest"
}

if (!((opts.ircChannel || opts.ircOpts.channels) &&
  opts.gitterApiKey && opts.gitterRoom && opts.ircNick)) {
  console.error('You need to set the config env variables (see readme.md)')
  process.exit(1)
}

var herokuURL = process.env.HEROKU_URL
if (herokuURL) {
  var request = require('request')
  require('http').createServer(function (req, res) {
    res.end('ping heroku\n')
  }).listen(process.env.PORT)
  setInterval(function () {
    request(herokuURL).pipe(process.stdout)
  }, 5 * 60 * 1000)
}

gitterBot(opts)
