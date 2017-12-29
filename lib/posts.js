import axios from 'axios'
import qs from 'qs'
import parse from 'parse-swap-title'

const url = (subreddit, params) => {
  return [
    `https://www.reddit.com/r/${subreddit}/search.json`,
    qs.stringify(params)
  ].join('?')
}

export const parsePosts = (posts) => {
  return posts.map((child) => {
    try {
      let post = parse(child.data.title)
      let trades = child.data.author_flair_css_class
        ? child.data.author_flair_css_class.match(/\d+/)[0]
        : 0

      return Object.assign(post, {
        id: child.data.id,
        url: child.data.url,
        raw_title: child.data.title,
        created_utc: child.data.created_utc,
        name: child.data.name,
        author: child.data.author,
        author_trades: trades,
      })
    } catch (e) {
      console.log("Couldn't parse", child.data.title);
    }
  }).filter(f => f)
}

export default (subreddit, params) => {
  params = Object.assign({
    raw_json: 1,
    sort: 'new',
    restrict_sr: 'on',
    q: 'flair:Selling',
  }, params)

  return axios.get(url(subreddit, params))
    .then((resp) => parsePosts(resp.data.data.children))
}
