import React, { Component } from 'react'
import PropTypes from 'prop-types'

const imgurId = (url) => {
  const matches = url.match(/imgur.com\/((:?a\/)?.*)?/)
  return matches && matches[1]
}

export default class Embed extends Component {
  componentDidMount() {
    let script = document.createElement('script')
    script.id = 'globalImgurEmbedScriptTagId'
    script.src = "//s.imgur.com/min/embed.js"
    script.type = "text/javascript"
    script.async = true

    document.querySelector('body').appendChild(script)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.url !== this.props.url
  }

  renderUrl(url, i) {
    if (/\.\w{3,4}$/.test(url)) {
      return <img key={i} src={url} />
    }

    if (/\/\/imgur\.com/) {
      const id = imgurId(url)

      return id && (
        <div key={i}>
          <blockquote className="imgur-embed-pub" lang="en" data-id={id}>
            <span data-href={url}></span>
          </blockquote>
        </div>
      )
    }
  }

  render() {
    return this.props.images.map(this.renderUrl)
  }
}

Embed.propTypes = {
  images: PropTypes.array
}

Embed.defaultProps = {
  images: []
}
