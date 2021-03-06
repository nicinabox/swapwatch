import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="grid">
          <div className="col-auto">
            <p className="text-muted text-small text-center">
              <a href="https://github.com/nicinabox/swapwatch">Contribute on Github</a>.
              {' '}
              Made with all the ❤ in the world by <a href="https://twitter.com/nicinabox">@nicinabox</a>.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
