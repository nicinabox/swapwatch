import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import withRedux from 'next-redux-wrapper'
import { bindActionCreators } from 'redux'
import { initStore } from '../store'
import { getPosts, search, setActiveTab } from '../actions'

import Head from '../components/Head'
import Menu, { TABS } from '../components/Menu'
import Posts from '../components/Posts'

export class App extends React.Component {
  static async getInitialProps({ store, query }) {
    if (query) {
      await store.dispatch(search(query.q))
    } else {
      await store.dispatch(getPosts(TABS[0]))
    }

    return {
      query: query.q
    }
  }

  constructor(props) {
    super(props)

    this._handleMenuItemPress = this._handleMenuItemPress.bind(this)
    this._handleSearch = debounce(this._handleSearch.bind(this), 200)

    this.state = {
      selectedTab: TABS.indexOf(props.tab),
      query: props.query
    }
  }

  _handleMenuItemPress(index) {
    this.setState({ selectedTab: index, })
    this.props.setActiveTab(TABS[index])
    this.props.getPosts(TABS[index])
  }

  _handleSearch(query) {
    if (query) {
      this.props.search(query)
      window.history.pushState('', '', `?q=${query}`)
    } else {
      window.history.pushState('', '', '/')
    }
  }

  render() {
    return (
      <div>
        <Head />

        <Menu
          query={this.state.query}
          onPress={this._handleMenuItemPress}
          onSearch={this._handleSearch}
        />

        <Posts />
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

export default withRedux(initStore, null, mapDispatchToProps)(App)
