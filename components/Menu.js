import React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import kebabCase from 'lodash/kebabCase'
import * as filters from '../lib/filters'
import { changeSubreddit } from '../actions'

export class Menu extends React.Component {
  constructor(props) {
    super(props)
    this._handleLinkClick = this._handleLinkClick.bind(this)
  }

  _handleLinkClick(e) {
    e.preventDefault()
    Router.push('/', e.target.pathname)
  }

  render() {
    const { currentPath } = this.props

    return (
      <div className="menu">
        <nav>
          {Object.keys(this.props.tabs).map((tab) => {
            const path = this.props.tabs[tab]

            return (
              <a
                key={tab}
                href={path}
                onClick={this._handleLinkClick}
                className={[
                  currentPath === path ? `${kebabCase(tab)}-bg active` : null,
                  `${kebabCase(tab)}-text`,
                ].join(' ')}>
                {tab}
              </a>
            )
          })}
        </nav>

        <form>
          {['mechmarket', 'hardwareswap'].map((subreddit) => {
            return (
              <label key={subreddit}>
                <input
                  type="radio"
                  name="subreddit"
                  value={subreddit}
                  onChange={() => this.props.changeSubreddit(subreddit)}
                  checked={subreddit === this.props.state.subreddit}
                />
                r/{subreddit}
              </label>
            )
          })}
        </form>
      </div>
    )
  }
}

export default connect((state) => ({
  state,
  tabs: filters[state.subreddit]
}), {
  changeSubreddit
})(Menu)
