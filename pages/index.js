import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import flatten from 'lodash/flatten'
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
    this.state = {}
    this.handleRefresh = this.handleRefresh.bind(this)
    this.onBeforeFetch = this.onBeforeFetch.bind(this)
    this.onResults = this.onResults.bind(this)
  }

  componentDidMount() {
    this.watcher = this.createWatcher()
    this.watcher.start()
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.didNewPostsChange(nextProps)) {
      this.watcher.before = nextProps.state.allPosts[0].name
    }

    if (this.didLocationChange(nextProps)) {
      this.watcher.stop()
      this.watcher = this.createWatcher(nextProps)
      this.watcher.start()
    }
  }

  componentWillUnmount() {
    this.watcher.stop()
  }

  didNewPostsChange(nextProps) {
    const { posts: nextPosts } = nextProps.state
    const { posts } = this.props.state
    return nextPosts[0] && !isEqual(nextPosts[0], posts[0])
  }

  didLocationChange(nextProps) {
    return ['location', 'subreddit', 'params'].some((name) => {
      return nextProps.state[name] !== this.props.state[name]
    })
  }

  onBeforeFetch() {
    if (this.ticker) clearTimeout(this.ticker)

    const { interval } = this.watcher
    const tick = 1000
    let t = interval

    this.ticker = setInterval(() => {
      t -= tick
      this.setState({ refreshInterval: t / 1000 })
    }, tick)
  }

  onResults(posts) {
    if (posts.length) {
      this.props.dispatch(receiveNewPosts(parsePosts(posts)))
    }
  }

  createWatcher(props = this.props) {
    const { activeTab, location, params, posts, allPosts } = props.state
    const flair = activeTab === 'All' ? '' : activeTab
    const before = (allPosts[0] || {}).name

    return new Watcher({
      subreddit: location.subreddit,
      term: params.q,
      before,
      flair,
    })
    .on('before fetch', this.onBeforeFetch)
    .on('results', this.onResults)
  }

  handleRefresh(e) {
    e.preventDefault()

    this.watcher.fetch()
    this.watcher.restart()

    this.setState({ refreshInterval: false })
  }

  getHeading() {
    const { params, activeTab } = this.props.state

    if (params.q) {
      return `Searching ${activeTab}`
    }

    return activeTab
  }

  formatSeconds(seconds) {
    return [
      Math.floor(seconds / 60),
      Math.floor(seconds % 60),
    ].join(':')
  }

  render() {
    const { posts, activeTab } = this.props.state
    const newPosts = posts[0] || []

    return (
      <div id="root">
        <Head
          badge={newPosts.length}
          activeTab={activeTab}
        />

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
                    {this.state.refreshInterval ? (
                      ` (${this.formatSeconds(this.state.refreshInterval)})`
                    ) : null}
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
  state: {
    ...state,
    allPosts: flatten(Object.values(state.posts))
  }
}))(App)
