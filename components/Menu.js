import React from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import tabs from '../lib/filters'
import { search } from '../actions'

export class Menu extends React.Component {
  constructor(props) {
    super(props)

    this._handleSearch = this._handleSearch.bind(this)
    this._handleSearchQueryChange = this._handleSearchQueryChange.bind(this)
    this._handleLinkClick = this._handleLinkClick.bind(this)

    this.state = {
      query: props.query || '',
      prevPath: props.currentPath,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      query: nextProps.query || '',
      prevPath: nextProps.currentPath,
    })
  }

  _handleSearchQueryChange(e) {
    let { value } = e.target
    this.setState({ query: value })

    if (!value) {
      Router.push('/', this.state.prevPath)
      this.setState({ prevPath: this.state.currentPath })
    }
  }

  _handleSearch(e) {
    e.preventDefault()

    const { query } = this.state

    if (query) {
      this.setState({ prevPath: this.props.currentPath })
      Router.push('/', `${this.props.currentPath}?q=${query}`)
    }
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
                className={currentPath === path ? 'active' : null}>
                {tab}
              </a>
            )
          })}
        </nav>

        <div className="search-container">
          <form onSubmit={this._handleSearch}>
            <input type="search"
              value={this.state.query}
              onChange={this._handleSearchQueryChange}
              onFocus={(e) => e.target.select()}
              placeholder="Search title, location, description..." />
          </form>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}), {
  search
})(Menu)
