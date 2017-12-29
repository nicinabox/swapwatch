import React from 'react'
import timeago from 'timeago.js'
import capitalize from 'lodash/capitalize'
import fetchPosts from '../lib/posts'

const INVERSES = {
  want: 'have',
  have: 'want'
}

const inverse = (field) => INVERSES[field]

const getHeading = (props) => {
  return props.query ? 'Search results' : 'New posts'
}

export default class Posts extends React.Component {
  constructor(props) {
    super()

    this._handleLoadMore = this._handleLoadMore.bind(this)

    this.state = {
      heading: getHeading(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
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

  _renderWantOrHave(post) {
    let field = inverse(this.props.titleField)

    return field && (
      <span className="text-muted">
        {capitalize(field)} {post[field]}
      </span>
    )
  }

  _renderLocation(post) {
    const location = [post.zone, post.region].filter(f => f).join('-')
    return location && (
      <span>{location}</span>
    )
  }

  _renderTimeAgo(post) {
    return (
      <span className="text-muted">
        {new timeago().format(post.created_utc * 1000)}
      </span>
    )
  }

  _renderTitle(post) {
    if (post.type === 'selling') {
      return post.have
    }

    if (post.type === 'buying') {
      return post.want
    }

    return post[post.type]
  }

  render() {
    let { posts } = this.props

    return (
      <div className="posts">
        <div className="container">
          <p className="text-muted">{this.state.heading}</p>

          <div>
            {posts.map((post) => {
              return (
                <a key={post.id} href={post.url} className="post">
                  <div className="post-meta">
                    {this._renderLocation(post)}
                    {this._renderTimeAgo(post)}
                  </div>

                  <strong>
                    {this._renderTitle(post)}
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
