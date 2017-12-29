import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { SELLING } from './lib/posts'

import {
  RECEIVE_POSTS,
  RECEIVE_NEXT_PAGE,
  SET_ACTIVE_TAB,
  RECEIVE_SEARCH_QUERY,
  CHANGE_SUBREDDIT,
  LOADING,
} from './actions'

const initialState = {
  tab: SELLING,
  subreddit: 'mechmarket'
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        posts: action.posts,
      }

    case RECEIVE_NEXT_PAGE:
      return {
        ...state,
        posts: state.posts.concat(action.posts),
      }

    case LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }

    case RECEIVE_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.query
      }

    case SET_ACTIVE_TAB:
      return {
        ...state,
        tab: action.tab
      }

    case CHANGE_SUBREDDIT:
      return {
        ...state,
        subreddit: action.subreddit
      }

    default:
      return state
  }
}


export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
