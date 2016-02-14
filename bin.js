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
  ircChannel: "#padrino",
  ircNick: "padrinobot",
  ircAdmin: "wikimatze",
  ircOpts: getIrcOpts(),
  gitterApiKey: "320136d0c80ac611a1552d24f62d967484e58caf",
  gitterRoom: "padrino/padrino-framework"
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
