import React, { Component } from 'react'
import timeago from 'timeago.js'

export default class Post extends Component {
  constructor(props) {
    super(props)

    const isBuying = props.post.type === 'buying'
    const title = props.post[props.post.type]

    this.state = {
      isBuying,
      title: isBuying ? props.post.want : props.post.have || title,
      details: isBuying ? props.post.have : props.post.want,
    }
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

  render() {
    const { post } = this.props

    return (
      <a href={post.url} className="post">
        <div className="post-meta">
          {this._renderLocation(post)}
          {this._renderTimeAgo(post)}
        </div>

        <strong>
          {this.state.title}
        </strong>

        {this.state.details && (
          <div className="post-meta">
            <span className="text-muted">
              {this.state.isBuying ? 'Have' : 'Want'}
              {' '}
              {this.state.details}
            </span>
          </div>
        )}
      </a>
    )
  }
}
