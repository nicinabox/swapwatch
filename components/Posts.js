import React from 'react'
import { connect } from 'react-redux'
import last from 'lodash/last'
import kebabCase from 'lodash/kebabCase'
import { getNextPage } from '../actions'
import Post from './Post'

export class Posts extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  getLastPageNumber() {
    let pages = Object.keys(this.props.state.posts)
    return last(pages)
  }

  getLastPage() {
    return this.props.state.posts[this.getLastPageNumber()] || []
  }

  getNextPage() {
    return +this.getLastPageNumber() + 1
  }

  handleLoadMore(e) {
    e.preventDefault()

    const { activeTab } = this.props.state
    const lastPost = last(this.getLastPage())
    const nextPage = this.getNextPage()

    this.props.getNextPage(lastPost.name, activeTab, nextPage)
  }

  renderPosts(posts) {
    return posts.map((post) => {
      return (
        <Post key={post.id} post={post} />
      )
    })
  }

  render() {
    const { posts, isLoading } = this.props.state

    return (
      <div className="posts">
        <div style={isLoading ? { opacity: 0.6 } : {}}>

          {Object.keys(posts).map((page) => {
            if (!posts[page].length) return
            const pageName = +page ? `Page ${page}` : 'New'

            return (
              <div key={page} className={['page', kebabCase(pageName)].join(' ')}>
                <h5 className="page-heading">
                  <span className="page-heading-text">
                    {pageName}
                  </span>
                </h5>
                {this.renderPosts(posts[page], page)}
              </div>
            )
          })}

          {this.getLastPage().length ? (
            <a href="#"
              onClick={this.handleLoadMore}
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
