import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import isEmpty from 'lodash/isEmpty'
import withRedux from 'next-redux-wrapper'
import qs from 'qs'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getPosts, search, setActiveTab } from '../actions'
import tabs from '../lib/filters'

import Head from '../components/Head'
import Header from '../components/Header'
import Menu from '../components/Menu'
import Search from '../components/Search'
import Posts from '../components/Posts'

const TAB_NAMES = Object.keys(tabs)

export class App extends React.Component {
  static async getInitialProps({ store, query, asPath }) {
    let [pathname, params] = asPath.split('?')
    const tab = startCase(pathname.replace('/', ''))

    query = !isEmpty(query) ? query : qs.parse(params)

    if (query.q) {
      await store.dispatch(search(`${query.q} flair:${JSON.stringify(tab)}`))
      store.dispatch(setActiveTab('Search'))
    } else {
      store.dispatch(setActiveTab(tab))
      await store.dispatch(getPosts(tab))
    }

    return {
      query,
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
          <div className="row">
            <div className="flex-1">
              <Menu currentPath={this.props.currentPath} />
            </div>

            <div className="flex-3">
              <h2>
                <strong>
                  {this.props.state.tab || 'All'}
                </strong>
              </h2>

              <Search
                query={this.props.query.q}
                currentPath={this.props.currentPath}
              />

              <Posts />
            </div>

            <div className="flex-1">
              <h3>Watch</h3>
            </div>
          </div>
        </div>
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

export default withRedux(initStore, (state) => ({state}), mapDispatchToProps)(App)
