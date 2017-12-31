import fetchPosts from './lib/posts'
import toQuery from './lib/toQuery'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_NEXT_PAGE = 'RECEIVE_NEXT_PAGE'
export const RECEIVE_NEW_POSTS = 'RECEIVE_NEW_POSTS'
export const MERGE_NEW_POSTS = 'MERGE_NEW_POSTS'
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'
export const RECEIVE_LOADING = 'RECEIVE_LOADING'
export const RECEIVE_LOCATION = 'RECEIVE_LOCATION'
export const RECEIVE_PARAMS = 'RECEIVE_PARAMS'

const handleError = (err) => {
  console.log(err)
}

export function setActiveTab(activeTab) {
  return {
    type: SET_ACTIVE_TAB,
    activeTab: activeTab || 'All'
  }
}

export function isLoading(bool) {
  return {
    type: RECEIVE_LOADING,
    isLoading: bool,
  }
}

export function getNextPage(after, flair, page) {
  return (dispatch, getState) => {
    dispatch(isLoading(true))
    const { location } = getState()

    return fetchPosts(location.subreddit, {
      after,
      q: toQuery(flair)
    })
      .then((posts) => {
        dispatch(receivePosts(posts, page))
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}

export function search(flair, query) {
  return (dispatch, getState) => {
    dispatch(isLoading(true))
    const { location } = getState()

    return fetchPosts(location.subreddit, { q: toQuery(flair, query) })
      .then((posts) => {
        dispatch(receivePosts(posts))
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}

export function receivePosts(posts, page = 1) {
  return {
    type: RECEIVE_POSTS,
    posts,
    page
  }
}

export function receiveNewPosts(posts, page = 0) {
  return {
    type: RECEIVE_NEW_POSTS,
    posts,
    page
  }
}

export function mergeNewPosts() {
  return {
    type: MERGE_NEW_POSTS
  }
}

export function receiveLocation(location) {
  return {
    type: RECEIVE_LOCATION,
    location
  }
}

export function receiveParams(params) {
  return {
    type: RECEIVE_PARAMS,
    params
  }
}
