import React from 'react'
import { insertRule, merge } from 'next/css'
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
      <nav className={styles.menu}>
        {TABS.map((item, i) => {
          return (
            <a key={i}
              href="#"
              onClick={(e) => this._handleTabPress(e, i)}
              className={merge(styles.menu_a, selectedTab === i ? styles.menu_a_active : null)}>
              {item}
            </a>
          )
        })}

        <input type="search"
          value={this.state.query}
          onChange={this._handleSearch}
          placeholder="Search..." />
      </nav>
    )
  }
}

let styles = createCSS({
  menu: {
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  menu_a: {
    display: 'inline-block',
    padding: 10,
  },
  menu_a_active: {
    fontWeight: 'bold'
  },
})
