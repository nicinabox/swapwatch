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
  receiveNewPosts,
  changeSubreddit
} from '../actions'
import Watcher from '../lib/watcher'
import { parsePosts } from '../lib/posts'

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

  constructor(props) {
    super(props)
    this.state = {
      status: ''
    }
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    this.watcher = this.createWatcher()
    this.watcher.start()
  }

  componentWillReceiveProps(nextProps, nextState) {
    const locationChanged = ['location', 'subreddit', 'params'].some((name) => {
      return nextProps.state[name] !== this.props[name]
    })

    if (locationChanged) {
      this.watcher.stop()
      this.watcher = this.createWatcher()
      this.watcher.start()
    }
  }

  componentWillUnmount() {
    this.watcher.stop()
  }

  createWatcher() {
    const { activeTab, location, params, posts } = this.props.state

    return new Watcher({
      subreddit: location.subreddit,
      flair: activeTab,
      term: params.q,
      before: posts.length && posts[0].name
    })
    .on('initial check', () => {
      console.log('checking');
      this.setState({ status: 'Checking for new posts...' })
    })
    .on('before check', () => {
      if (this.ticker) clearTimeout(this.ticker)

      const { interval } = this.watcher
      let t = interval, tick = 1000

      this.ticker = setInterval(() => {
        t = t - tick
        this.setState({ refreshInterval: t / 1000 })
      }, tick)
    })
    .on('results', (posts) => {
      this.props.dispatch(receiveNewPosts(parsePosts(posts)))
    })
  }

  handleRefresh(e) {
    e.preventDefault()
    this.setState({ refreshInterval: false })
    this.watcher.stop()
    this.watcher.check()
    this.watcher.start()
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
              <header className="d-flex justify-space-between align-center">
                <h2>
                  {this.getHeading()}
                </h2>

                <div className="status">
                  <a href="#" className="text-underline" onClick={this.handleRefresh}>
                    Refresh
                    {this.state.refreshInterval && (
                      ` (${this.state.refreshInterval}s)`
                    )}
                  </a>
                </div>
              </header>

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
