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
  }

  componentDidMount() {
    const { location, params, posts } = this.props.state

    this.watcher = new Watcher({
      subreddit: location.subreddit,
      flair: location.filter,
      term: params.q,
      before: posts.length && posts[0].name
    })
    .on('initial check', () => {
      this.setState({ status: 'Checking for new posts...' })
    })
    .on('before check', () => {
      if (this.ticker) clearTimeout(this.ticker)

      const { interval } = this.watcher
      let t = interval, tick = 1000

      const updateStatus = () => {
        t = t - tick
        this.setState({ status: `Refresh in ${t / 1000}s` })
      }

      this.ticker = setInterval(() => {
        updateStatus()
      }, tick)

      updateStatus()
    })
    .on('results', (posts) => {
      this.setState({
        status: `Found ${posts.length} new posts`
      })

      this.props.dispatch(receiveNewPosts(parsePosts(posts)))
    })

    this.watcher.start()
  }

  componentWillUnmount() {
    this.watcher.stop()
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
              <h2 className="d-flex justify-space-between">
                <strong>
                  {this.getHeading()}
                </strong>

                <div className="status text-muted text-small text-normal">
                  <span>{this.state.status}</span>
                  {'  '}
                  <button className="button-outline" onClick={(e) => {
                    e.preventDefault()
                    this.watcher.start()
                  }}>
                    Refresh
                  </button>
                </div>
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
