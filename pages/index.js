import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import isEmpty from 'lodash/isEmpty'
import withRedux from 'next-redux-wrapper'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import {
  getPosts,
  search,
  setActiveTab,
  receiveSearchQuery,
  changeSubreddit
} from '../actions'

import Head from '../components/Head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import Search from '../components/Search'
import Posts from '../components/Posts'

const route = pathToRegexp('/:subreddit/:filter?')

export class App extends React.Component {
  static async getInitialProps({ store, query, asPath }) {
    let [pathname, params] = asPath.split('?')
    let [, subreddit, filter] = route.exec(pathname)
    let tab = startCase(filter)

    query = !isEmpty(query) ? query : qs.parse(params)

    store.dispatch(receiveSearchQuery(query.q))

    if (subreddit !== store.getState().subreddit) {
      store.dispatch(changeSubreddit(subreddit))
    }

    if (query.q) {
      store.dispatch(setActiveTab(`Searching ${tab}`))
      await store.dispatch(search(tab, query.q))
    } else {
      store.dispatch(setActiveTab(tab))
      await store.dispatch(getPosts(tab))
    }

    return {
      currentPath: pathname,
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="root">
        <Head />

        <Header />

        <div id="main" className="container">
          <div className="grid">
            <div className="col-xs-3 col-md-2">
              <Menu currentPath={this.props.currentPath} />
            </div>

            <div className="col-xs-9 col-md-8">
              <h2>
                <strong>
                  {this.props.state.tab || 'All'}
                </strong>
              </h2>

              <Search
                currentPath={this.props.currentPath}
              />

              <Posts />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: bindActionCreators(getPosts, dispatch),
    search: bindActionCreators(search, dispatch),
    setActiveTab: bindActionCreators(setActiveTab, dispatch),
  }
}

export default withRedux(initStore, (state) => ({
  state
}), mapDispatchToProps)(App)
