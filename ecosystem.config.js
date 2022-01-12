module.exports = {
  apps : [{
    name   : "effinity",
    script : "./build/server.js",
    instances:'max',
    exec_mode: 'cluster',
    autorestart: true,
  }]
}
