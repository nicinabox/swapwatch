import React, { Component } from 'react'
import timeago from 'timeago.js'
import startCase from 'lodash/startCase'
import kebabCase from 'lodash/kebabCase'

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

  _renderLocation() {
    const location = [
      this.props.post.zone,
      this.props.post.region
    ].filter(f => f).join('-')

    return location && (
      <span>{location}</span>
    )
  }

  _renderTimeAgo() {
    return (
      <span className="text-muted">
        {new timeago().format(this.props.post.created_utc * 1000)}
      </span>
    )
  }

  _renderAuthor() {
    return (
      <span className="text-muted">
        {this.props.post.author} ({this.props.post.author_trades} trades)
      </span>
    )
  }

  _renderFlair() {
    return (
      <span
        className={[
          `${kebabCase(this.props.post.type)}-text`,
          'pull-right'
        ].join(' ')}>
        {startCase(this.props.post.type)}
      </span>
    )
  }

  _renderImages() {
    let {images} = this.props.post
    if (!images.length) return

    return (
      <nav className="images">
        {images.map((url, i) => (
          <a href={url} key={i}>{url}</a>
        ))}
      </nav>
    )
  }

  render() {
    const { post } = this.props

    return (
      <a href={post.url} className={[
        'post',
        `type-${kebabCase(post.type)}`
      ].join(' ')}>
        <div className="post-meta">
          {this._renderLocation()}
          {this._renderTimeAgo()}
          {this._renderAuthor()}
          {this._renderFlair()}
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
