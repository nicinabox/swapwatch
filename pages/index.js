import React from 'react'
import debounce from 'lodash/debounce'
import startCase from 'lodash/startCase'
import fetchPosts from '../lib/posts'
import search from '../lib/search'
import Head from '../components/Head'
import Menu, { TABS } from '../components/Menu'
import Posts from '../components/Posts'

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
    }
  }

  _handleMenuItemPress(index) {
    this.setState({
      selectedTab: index,
    })

    let flair = startCase(TABS[index])

    fetchPosts({
      q: `flair:"${flair}"`
    })
    .then((posts) => {
      this.setState({
        results: posts
      })
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
          type={TABS[this.state.selectedTab]} />
      </div>
    )
  }
}
