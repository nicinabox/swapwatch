import axios from 'axios'

var parser = require('./parser')

const url = 'https://www.reddit.com/r/mechmarket/new.json'

export const SELLING = 'selling'
export const BUYING = 'buying'
export const GROUP_BUY = 'group buy'
export const INTEREST_CHECK = 'interest check'
export const ARTISAN = 'artisan'
export const VENDOR = 'vendor'
export const META = 'meta'

const isPayment = (str) => {
  return (/paypal|cash|trade|emt|\$|ltc|btc|google/i).test(str)
}

const isArtisan = (str) => (/^artisans?$/i).test(str)
const isGroupBuy = (str) => (/^gb$/i).test(str)
const isInterestCheck = (str) => (/^ic$/i).test(str)
const isVendor = (str) => (/^vendor$/i).test(str)
const isMeta = (str) => (/^meta$/i).test(str)

const getType = (post) => {
  if (isPayment(post.have))      return BUYING
  if (isPayment(post.want))      return SELLING
  if (isGroupBuy(post.tag))      return GROUP_BUY
  if (isArtisan(post.tag))       return ARTISAN
  if (isInterestCheck(post.tag)) return INTEREST_CHECK
  if (isVendor(post.tag))        return INTEREST_CHECK
  if (isMeta(post.tag))          return META

  return null
}

export const parsePosts = (posts) => {
  return posts.map((child) => {
    try {
      let post = parser.parse(child.data.title)
      return Object.assign(post, {
        id: child.data.id,
        url: child.data.url,
        raw_title: child.data.title,
        created_utc: child.data.created_utc,
        name: child.data.name,
        type: getType(post),
      })
    } catch (e) {
      console.log("Couldn't parse", child.data.title);
    }
  }).filter(f => f)
}

export default (params) => {
  params = Object.assign({
    raw_json: 1
  }, params)

  return axios.get(url, { params })
    .then((resp) => parsePosts(resp.data.data.children))
}
