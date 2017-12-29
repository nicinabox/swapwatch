import axios from 'axios'
import qs from 'qs'
import parse from 'swap-parser'

const url = 'https://www.reddit.com/r/mechmarket/search.json'

export const SELLING = 'Selling'
export const BUYING = 'Buying'
export const GROUP_BUY = 'Group Buy'
export const INTEREST_CHECK = 'Interest Check'
export const ARTISAN = 'Artisan'
export const VENDOR = 'Vendor'
export const META = 'Meta'

export const parsePosts = (posts) => {
  return posts.map((child) => {
    try {
      let post = parse(child.data.title)

      return Object.assign(post, {
        id: child.data.id,
        url: child.data.url,
        raw_title: child.data.title,
        created_utc: child.data.created_utc,
        name: child.data.name,
      })
    } catch (e) {
      console.log("Couldn't parse", child.data.title);
    }
  }).filter(f => f)
}

export default (params) => {
  params = Object.assign({
    raw_json: 1,
    sort: 'new',
    restrict_sr: 'on',
    q: 'flair:Selling',
  }, params)

  return axios.get(url + '?' + qs.stringify(params))
    .then((resp) => parsePosts(resp.data.data.children))
}
