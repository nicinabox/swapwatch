import React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import kebabCase from 'lodash/kebabCase'
import tabs from '../lib/filters'

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
          {Object.keys(tabs).map((tab) => {
            const path = tabs[tab]

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
      </div>
    )
  }
}

export default connect((state) => ({state}), {
})(Menu)
