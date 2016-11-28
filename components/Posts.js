import React from 'react'
import timeago from 'timeago.js'
import capitalize from 'lodash/capitalize'
import createCSS from '../lib/createCSS'
import fetchPosts from '../lib/posts'

const INVERSES = {
  want: 'have',
  have: 'want'
}

const inverse = (field) => INVERSES[field]

const getTitleField = (selectedTab) => {
  let fields = ['have', 'want']
  return fields[selectedTab] || 'title'
}

const getHeading = (props) => {
  return props.query ? 'Search results' : 'New posts'
}

export default class Posts extends React.Component {
  constructor(props) {
    super()

    this._handleLoadMore = this._handleLoadMore.bind(this)

    this.state = {
      posts: props.posts || [],
      heading: getHeading(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: nextProps.posts,
      heading: getHeading(nextProps),
      isSearching: !!nextProps.query,
    })
  }

  _handleLoadMore(e) {
    e.preventDefault()

    let params = {
      after: this.state.posts[this.state.posts.length - 1].name
    }

    fetchPosts(params)
      .then((posts) => {
        this.setState({ posts: this.state.posts.concat(posts) })
      })
  }

  _getMatchingPosts() {
    let { posts } = this.state
    let { type } = this.props

    return posts.filter(p => p.type === type)
  }

  _renderWantOrHave(post) {
    let field = inverse(this.props.titleField)

    return field && (
      <span className="text-muted">
        {capitalize(field)} {post[field]}
      </span>
    )
  }

  _renderLocation(post) {
    return post.location && (
      <span>{post.location}</span>
    )
  }

  _renderTimeAgo(post) {
    return (
      <span className="text-muted">
        {new timeago().format(post.created_utc * 1000)}
      </span>
    )
  }

  render() {
    let { titleField } = this.props
    let posts = this._getMatchingPosts()

    return (
      <div className="posts">
        <div className="container">
          <p className="text-muted">{this.state.heading}</p>

          <div>
            {posts.map((post, i) => {
              return (
                <a key={i} href={post.url} className="post">
                  <div className="post-meta">
                    {this._renderLocation(post)}
                    {this._renderTimeAgo(post)}
                  </div>

                  <strong>
                    {post[titleField]}
                  </strong>

                  <div className="post-meta">
                    {this._renderWantOrHave(post)}
                  </div>
                </a>
              )
            })}
            <a href="#"
              onClick={this._handleLoadMore}
              className="load-more">
              More
            </a>
          </div>
        </div>
      </div>
    )
  }
}
