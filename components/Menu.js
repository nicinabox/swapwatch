import React from 'react'
import { SELLING, BUYING, ARTISAN, GROUP_BUY, INTEREST_CHECK, VENDOR } from '../lib/posts'
import createCSS from '../lib/createCSS'

export const TABS = [SELLING, BUYING, ARTISAN, GROUP_BUY, INTEREST_CHECK, VENDOR]

export default class Menu extends React.Component {
  constructor() {
    super()

    this._handleSearch = this._handleSearch.bind(this)
    this._handleTabPress = this._handleTabPress.bind(this)

    this.state = {
      selectedTab: 0,
      query: '',
    }
  }

  _handleTabPress(e, index) {
    e.preventDefault()

    this.setState({
      selectedTab: index,
    })

    this.props.onPress(index)
  }

  _handleSearch(e) {
    let { value } = e.target
    this.setState({ query: value })
    this.props.onSearch(value)
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
          <input type="search"
            value={this.state.query}
            onChange={this._handleSearch}
            placeholder="Search..." />
        </div>
      </div>
    )
  }
}
