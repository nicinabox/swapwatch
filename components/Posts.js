import React from 'react'
import { connect } from 'react-redux'
import { getNextPage } from '../actions'
import Post from './Post'

export class Posts extends React.Component {
  constructor(props) {
    super(props)
    this._handleLoadMore = this._handleLoadMore.bind(this)
  }

  _handleLoadMore(e) {
    e.preventDefault()

    const { posts, activeTab } = this.props.state

    this.props.getNextPage(posts[posts.length - 1].name, activeTab)
  }

  render() {
    let { isLoading, posts = [] } = this.props.state

    return (
      <div className="posts">
        <div style={isLoading ? { opacity: 0.6 } : {}}>
          {posts.map((post) => {
            return (
              <Post key={post.id} post={post} />
            )
          })}

          {this.props.state.hasNextPage ? (
            <a href="#"
              onClick={this._handleLoadMore}
              className="load-more">
              More
            </a>
          ) : (
            <span className="load-more load-more-disabled">
              No more pages
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default connect(state => ({state}),{
  getNextPage
})(Posts)
