import React from 'react'
import { SELLING, BUYING, ARTISAN, GROUP_BUY, INTEREST_CHECK, VENDOR } from '../lib/posts'

export const TABS = [SELLING, BUYING, ARTISAN, GROUP_BUY, INTEREST_CHECK, VENDOR]

export default class Menu extends React.Component {
  constructor(props) {
    super(props)

    this._handleSearch = this._handleSearch.bind(this)
    this._handleTabPress = this._handleTabPress.bind(this)
    this._handleSearchQueryChange = this._handleSearchQueryChange.bind(this)

    this.state = {
      selectedTab: 0,
      query: props.query,
    }
  }

  _handleTabPress(e, index) {
    e.preventDefault()

    this.setState({
      selectedTab: index,
    })

    this.props.onPress(index)
  }

  _handleSearchQueryChange(e) {
    let { value } = e.target
    this.setState({ query: value })

    if (!value) {
      this.props.onSearch()
    }
  }

  _handleSearch(e) {
    e.preventDefault()
    this.props.onSearch(this.state.query)
  }

  render() {
    let { selectedTab } = this.state

    return (
      <div className="menu">
        <nav>
          {TABS.map((item, i) => {
            return (
              <a key={i}
                href="#"
                onClick={(e) => this._handleTabPress(e, i)}
                className={selectedTab === i ? 'active' : null}>
                {item}
              </a>
            )
          })}
        </nav>

        <div className="search-container">
          <form onSubmit={this._handleSearch}>
            <input type="search"
              value={this.state.query}
              onChange={this._handleSearchQueryChange}
              placeholder="Search..." />
          </form>
        </div>
      </div>
    )
  }
}
