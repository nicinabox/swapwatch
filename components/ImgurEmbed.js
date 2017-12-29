import React, { Component } from 'react'

const globalImgurEmbedScriptTagId = 'globalImgurEmbedScriptTag'

export default class ImgurEmbed extends Component {
  constructor(props) {
    super(props)

    let schemelessUrl = props.url.replace('http:', '')
    let id, match = schemelessUrl.match(/(?:a\/)?\w+$/)

    if (match) {
      id = match[0]
    }

    this.state = {
      url: schemelessUrl,
      id,
    }
  }

  componentDidMount() {
    let newScriptTag = document.createElement('script')
    newScriptTag.id = globalImgurEmbedScriptTagId
    newScriptTag.src = '//s.imgur.com/min/embed.js'
    newScriptTag.type = 'text/javascript'
    newScriptTag.async = true

    document.querySelector('body').appendChild(newScriptTag)
  }

  render() {
    return (
      <div>
        <blockquote className="imgur-embed-pub" lang="en" data-id={this.state.id}>
        </blockquote>
      </div>
    )
  }
}
