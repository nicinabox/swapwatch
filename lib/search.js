import axios from 'axios'
import { parsePosts } from './posts'

let url = 'https://www.reddit.com/r/mechmarket/search.json'

export default (query, params = {}) => {
  if (!query) return

  params = Object.assign({
    q: query,
    raw_json: 1,
    restrict_sr: 'on',
    sort: 'new',
  }, params)

  return axios.get(url, { params })
    .then((resp) => parsePosts(resp.data.data.children))
}
