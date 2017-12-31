import qs from 'qs'

export default (subreddit, params) => {
  return [
    `https://www.reddit.com/r/${subreddit}/search.json`,
    qs.stringify(params)
  ].join('?')
}
