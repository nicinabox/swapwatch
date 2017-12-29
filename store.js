import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { SELLING } from './lib/posts'

import {
  RECEIVE_POSTS,
  RECEIVE_NEXT_PAGE,
  SET_ACTIVE_TAB,
  LOADING,
} from './actions'

const initialState = {
  tab: SELLING
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        posts: action.posts,
        query: action.query,
      }

    case RECEIVE_NEXT_PAGE:
      return {
        ...state,
        posts: state.posts.concat(action.posts),
        query: action.query,
      }

    case LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }

    case SET_ACTIVE_TAB:
      return {
        ...state,
        tab: action.tab
      }

    default:
      return state
  }
}


export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
