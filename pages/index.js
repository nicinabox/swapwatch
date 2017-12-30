import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import isEmpty from 'lodash/isEmpty'
import withRedux from 'next-redux-wrapper'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'
import { initStore } from '../store'
import {
  getPosts,
  search,
  setActiveTab,
  receiveParams,
  receiveLocation,
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
    const [pathname, params] = asPath.split('?')
    const [, subreddit, filter] = route.exec(pathname)
    const activeTab = startCase(filter)

    query = !isEmpty(query) ? query : qs.parse(params)

    store.dispatch(receiveLocation({
      subreddit,
      filter,
      pathname
    }))
    store.dispatch(receiveParams(query))
    store.dispatch(setActiveTab(activeTab))

    await store.dispatch(search(activeTab, query.q))
  }

  getHeading() {
    const { params, activeTab } = this.props.state

    if (params.q) {
      return `Searching ${activeTab}`
    }

    return activeTab
  }

  render() {
    return (
      <div id="root">
        <Head />

        <Header />

        <div id="main" className="container">
          <div className="grid">
            <div className="col-xs-3 col-md-2">
              <Menu />
            </div>

            <div className="col-xs-9 col-md-8">
              <h2>
                <strong>
                  {this.getHeading()}
                </strong>
              </h2>

              <Search />
              <Posts />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default withRedux(initStore, (state) => ({
  state
}))(App)
