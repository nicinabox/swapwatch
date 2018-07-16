import qs from 'qs'

export default (subreddit, params) => {
  const endpoint = params.q ? 'search' : 'new'

  return [
    `https://www.reddit.com/r/${subreddit}/${endpoint}.json`,
    qs.stringify(params)
  ].join('?')
}
