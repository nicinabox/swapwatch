import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import {
  RECEIVE_POSTS,
  RECEIVE_NEXT_PAGE,
  RECEIVE_NEW_POSTS,
  SET_ACTIVE_TAB,
  RECEIVE_LOCATION,
  RECEIVE_PARAMS,
  RECEIVE_LOADING,
} from './actions'

const initialState = {
  activeTab: '',
  params: {},
  location: {},
  hasNextPage: true,
  isLoading: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasNextPage: !!action.posts.length,
      }

    case RECEIVE_NEXT_PAGE:
      return {
        ...state,
        posts: state.posts.concat(action.posts),
        hasNextPage: !!action.posts.length,
      }

    case RECEIVE_NEW_POSTS:
      return {
        ...state,
        posts: action.posts.concat(state.posts),
      }

    case RECEIVE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }

    case RECEIVE_PARAMS:
      return {
        ...state,
        params: action.params
      }

    case RECEIVE_LOCATION:
      return {
        ...state,
        location: action.location
      }

    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      }

    default:
      return state
  }
}


export const initStore = (initialState = initialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
