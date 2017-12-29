import React from 'react'
import { connect } from 'react-redux'
import * as filters from '../lib/filters'

export class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="grid ">
          <div className="col-auto">
            <a href={`/${this.props.state.subreddit}`} className="logo">
              SwapWatch
            </a>
          </div>

          <div className="col-auto">
            <nav className="text-right">
              {Object.keys(filters).map((subreddit) => {
                return (
                  <a
                    key={subreddit}
                    href={`/${subreddit}`}
                    onClick={this._handleLinkClick}
                    className={subreddit === this.props.state.subreddit ? 'active' : ''}>
                    r/{subreddit}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Header)
