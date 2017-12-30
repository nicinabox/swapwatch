// This file doesn't not go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

const redirects = [
  { from: '/', to: '/mechmarket' },
]

const whitelistPaths = [
  '/',
  '/favicon.ico'
]

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    redirects.forEach(({ from, to, type = 301 }) => {
      if (pathname === from) {
        res.writeHead(type, {
          'Location': to
        })
        res.end()
      }
    })

    if (!whitelistPaths.includes(pathname)) {
      app.render(req, res, '/', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(PORT, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + PORT)
  })
})
