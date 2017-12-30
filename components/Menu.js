import React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import kebabCase from 'lodash/kebabCase'
import * as filters from '../lib/filters'

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
    const { pathname } = this.props.state.location

    return (
      <div className="menu">
        <nav>
          {Object.keys(this.props.tabs).map((tab) => {
            const path = '/' + [
              this.props.state.location.subreddit,
              this.props.tabs[tab]
            ].filter(f => f).join('/')

            return (
              <a
                key={tab}
                href={path}
                onClick={this._handleLinkClick}
                className={[
                  pathname === path ? `active active-${kebabCase(tab)}` : null,
                  `${kebabCase(tab)}-text`,
                ].join(' ')}>
                {tab}
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
  tabs: filters[state.location.subreddit]
}))(Menu)
