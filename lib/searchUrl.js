import qs from 'qs'

export default (subreddit, params) => {
  const endpoint = params.q ? 'search' : 'new'
  const host = typeof window === 'undefined' ? 'https://reddit.com' : ''

  return [
    host + `/r/${subreddit}/${endpoint}.json`,
    qs.stringify(params)
  ].join('?')
}
