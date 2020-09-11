// const target = require('./target')
// const target = "http://nginx-nc"
const targetmap = "http://nginx-nc"
const target = "http://192.168.2.100:8081"
module.exports = {
  "/api": {
    "target": target,
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/api": "/api"
    }
  },
  "/gaodemap": {
    "target": targetmap,
    // "target": "http://127.0.0.1:8080",
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/gaodemap": "/gaodemap"
    }
  },
  "/darkblue": {
    "target": targetmap,
    // "target": "http://nginx-wh",
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/darkblue": "/darkblue"
    }
  },
  "/font": {
    "target": target,
    // "target": "http://nginx-wh",
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/font": "/font"
    }
  },
  "/hzfile": {
    "target": target,
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/hzfile": "/hzfile"
    }
  },
  "/file": {
    "target": target,
    "changeOrigin": true,
    "ws": false,
    "pathRewrite": {
      "^/file": "/file"
    }
  },
}