// This file doesn't not go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel

const express = require('express')
const request = require('request')
const next = require('next')

const env = process.env.NODE_ENV
const dev = env !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use('/r*', (req, res) => {
    const url = 'https://reddit.com/' + req.originalUrl
    req.pipe(request(url)).pipe(res)
  })

  server.get('/', (req, res) => res.redirect(301, '/mechmarket'))

  server.get('/:subreddit/:flair?', (req, res) => {
    app.render(req, res, '/', req.query)
  })

  server.get('*', (req, res) => {
    handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on port ${port} [${env}]`)
  })
})
