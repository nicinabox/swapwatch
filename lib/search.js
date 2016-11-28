import axios from 'axios'

let url = 'https://www.reddit.com/r/mechmarket/search.json'

export default (query, params = {}) => {
  let options = Object.assign({}, {
    params: Object.assign({
      q: query,
      restrict_sr: 'on',
      sort: 'new',
    }, params)
  })

  return axios.get(url, options)
}
