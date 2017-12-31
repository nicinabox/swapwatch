import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import {
  RECEIVE_POSTS,
  RECEIVE_NEW_POSTS,
  SET_ACTIVE_TAB,
  RECEIVE_LOCATION,
  RECEIVE_PARAMS,
  RECEIVE_LOADING,
  MERGE_NEW_POSTS,
} from './actions'

const initialState = {
  activeTab: '',
  params: {},
  location: {},
  posts: {},
  isLoading: false,
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.page]: action.posts,
        },
      }

    case RECEIVE_NEW_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.page]: action.posts.concat(state.posts[action.page] || []),
        }
      }

    case MERGE_NEW_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          '0': [],
          '1': [...state.posts['0'], ...state.posts['1']]
        }
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
        location: action.location,
        posts: {
          '1': state.posts['1']
        },
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
