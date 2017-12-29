import fetchPosts from './lib/posts'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_NEXT_PAGE = 'RECEIVE_NEXT_PAGE'
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'
export const LOADING = 'LOADING'

const handleError = (err) => {
  console.log(err)
}

export function setActiveTab(tab) {
  return {
    type: SET_ACTIVE_TAB,
    tab
  }
}

export function isLoading(bool) {
  return {
    type: LOADING,
    isLoading: bool,
  }
}

export function getPosts(flair) {
  const q = flair ? `flair:${JSON.stringify(flair)}` : null
  return search(q)
}

export function getNextPage(params) {
  return (dispatch) => {
    dispatch(isLoading(true))

    return fetchPosts(params)
      .then((posts) => {
        dispatch({
          type: RECEIVE_NEXT_PAGE,
          query: params.query,
          posts
        })
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}

export function search(q) {
  return (dispatch) => {
    dispatch(isLoading(true))

    return fetchPosts({ q })
      .then((posts) => {
        dispatch({
          type: RECEIVE_POSTS,
          query: q,
          posts,
        })
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}
