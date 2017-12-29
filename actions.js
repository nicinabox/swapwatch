import Router from 'next/router'
import fetchPosts from './lib/posts'
import toQuery from './lib/toQuery'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_NEXT_PAGE = 'RECEIVE_NEXT_PAGE'
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'
export const RECEIVE_SEARCH_QUERY = 'RECEIVE_SEARCH_QUERY'
export const CHANGE_SUBREDDIT = 'CHANGE_SUBREDDIT'
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

export function receiveSearchQuery(query) {
  return {
    type: RECEIVE_SEARCH_QUERY,
    query
  }
}

export function isLoading(bool) {
  return {
    type: LOADING,
    isLoading: bool,
  }
}

export function getPosts(flair) {
  return search(flair)
}

export function getNextPage(after, flair) {
  return (dispatch, getState) => {
    dispatch(isLoading(true))
    const { subreddit } = getState()

    return fetchPosts(subreddit, {
      after,
      q: toQuery(flair)
    })
      .then((posts) => {
        dispatch({
          type: RECEIVE_NEXT_PAGE,
          posts
        })
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}

export function search(flair, query) {
  return (dispatch, getState) => {
    dispatch(isLoading(true))
    const { subreddit } = getState()

    return fetchPosts(subreddit, { q: toQuery(flair, query) })
      .then((posts) => {
        dispatch({
          type: RECEIVE_POSTS,
          posts,
        })
        dispatch(isLoading(false))
      })
      .catch(handleError)
  }
}

export function changeSubreddit(subreddit) {
  return {
    type: CHANGE_SUBREDDIT,
    subreddit
  }
}
