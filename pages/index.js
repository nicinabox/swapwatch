import 'glamor/reset'
import React from 'react'
import debounce from 'lodash/debounce'
import createCSS from '../lib/createCSS'
import fetchPosts, { parsePosts } from '../lib/posts'
import search from '../lib/search'
import Head from '../components/Head'
import Menu, { TABS } from '../components/Menu'
import Posts from '../components/Posts'

const getTitleField = (selectedTab) => {
  let fields = ['have', 'want']
  return fields[selectedTab] || 'title'
}

export default class App extends React.Component {
  static async getInitialProps({ query }) {
    return await Promise.all([fetchPosts(), search(query.q)])
      .then(([posts, results]) => {
        return ({
          posts,
          results,
          query: query.q
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  constructor(props) {
    super(props)

    this._handleMenuItemPress = this._handleMenuItemPress.bind(this)
    this._handleSearch = debounce(this._handleSearch.bind(this), 200)

    this.state = {
      selectedTab: 0,
      query: props.query,
      results: props.results,
      titleField: getTitleField(0)
    }
  }

  _handleMenuItemPress(index) {
    this.setState({
      selectedTab: index,
      titleField: getTitleField(index)
    })
  }

  _handleSearch(query) {
    this.setState({ query })

    if (query) {
      window.history.pushState('', '', `?q=${query}`)

      search(query)
        .then((results) => {
          console.log(results);
          this.setState({ results })
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      window.history.pushState('', '', '/')
      this.setState({ results: null })
    }
  }

  render() {
    return (
      <div>
        <Head />

        <Menu
          query={this.state.query}
          onPress={this._handleMenuItemPress}
          onSearch={this._handleSearch} />

        <Posts
          query={this.state.query}
          posts={this.state.results || this.props.posts}
          type={TABS[this.state.selectedTab]}
          titleField={this.state.titleField} />
      </div>
    )
  }
}
