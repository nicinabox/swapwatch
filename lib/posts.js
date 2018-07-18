import axios from 'axios'
import parse from 'parse-swap-title'
import { uniq } from 'lodash'
import searchUrl from './searchUrl'

const imagePatterns = {
  imgurGallery: /https?:\/\/imgur.com(?:\/\w*)?\/\w+/g,
  imgurDirect: /https?:\/\/i.imgur.com\/\w+\.\w+/g,
  puush: /https?:\/\/puu.sh\/[\/\w]*\.\w+/g,
  flickr: /https?:\/\/(?:www\.)?flickr\.com\/photos\/[@\-\/\w]*/g,
}

const scrapeImages = (body) => {
  const urls = Object.values(imagePatterns).reduce((acc, pattern) => {
    return acc.concat(body.match(pattern))
  }, []).filter(f => f)

  return uniq(urls)
}

const parseTrades = (cssClass) => {
  let match = cssClass && cssClass.match(/\d+/)
  if (match) return match[0]
  return 0
}

export const parsePosts = (posts) => {
  return posts.map((child) => {
    if ((/meta/i).test(child.link_flair_text)) return

    try {
      const post = parse(child.data.title)
      const trades = parseTrades(child.data.author_flair_css_class)
      const images = scrapeImages(child.data.selftext)

      return Object.assign(post, {
        id: child.data.id,
        url: child.data.url,
        raw_title: child.data.title,
        created_utc: child.data.created_utc,
        name: child.data.name,
        author: child.data.author,
        author_trades: trades,
        images,
      })
    } catch (e) {
      console.log(e.message, child.data.title);
    }
  }).filter(f => f)
}

export default (subreddit, params) => {
  params = Object.assign({
    raw_json: 1,
    sort: 'new',
    restrict_sr: 'on',
  }, params)

  return axios.get(searchUrl(subreddit, params))
    .then((resp) => parsePosts(resp.data.data.children))
}
