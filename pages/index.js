import 'glamor/reset'
import React from 'react'
import createCSS from '../lib/createCSS'
import { fetchPosts, parsePosts } from '../lib/posts'
import search from '../lib/search'
import Head from '../components/Head'
import Menu, { TABS } from '../components/Menu'
import Posts from '../components/Posts'

const getTitleField = (selectedTab) => {
  let fields = ['have', 'want']
  return fields[selectedTab] || 'title'
}

export default class App extends React.Component {
  static async getInitialProps() {
    return await fetchPosts()
      .then((resp) => parsePosts(resp.data.data.children))
      .then((posts) => ({ posts }))
      .catch((err) => {
        console.log(err)
      })
  }

  constructor() {
    super()

    this._handleMenuItemPress = this._handleMenuItemPress.bind(this)
    this._handleSearch = this._handleSearch.bind(this)

    this.state = {
      selectedTab: 0,
      query: '',
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

    search(query)
      .then((resp) => parsePosts(resp.data.data.children))
      .then((posts) => {
        console.log(posts);
        this.setState({
          results: posts
        })
      })
  }

  render() {
    return (
      <div>
        <Head />

        <Menu
          onPress={this._handleMenuItemPress}
          onSearch={this._handleSearch} />

        <Posts
          posts={this.state.results || this.props.posts}
          query={this.state.query}
          type={TABS[this.state.selectedTab]}
          titleField={this.state.titleField} />
      </div>
    )
  }
}
