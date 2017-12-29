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
            const path = '/' + [
              this.props.state.subreddit,
              this.props.tabs[tab]
            ].filter(f => f).join('/')

            return (
              <a
                key={tab}
                href={path}
                onClick={this._handleLinkClick}
                className={[
                  currentPath === path ? `active active-${kebabCase(tab)}` : null,
                  `${kebabCase(tab)}-text`,
                ].join(' ')}>
                {tab}
              </a>
            )
          })}
        </nav>

        <nav>
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
    )
  }
}

export default connect((state) => ({
  state,
  tabs: filters[state.subreddit]
}), {
  changeSubreddit
})(Menu)
