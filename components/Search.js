import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import { search } from '../actions'

export class Search extends Component {
  constructor(props) {
    super(props)

    this._handleSearch = this._handleSearch.bind(this)
    this._handleSearchQueryChange = this._handleSearchQueryChange.bind(this)

    this.state = {
      value: props.state.searchQuery || '',
      prevPath: props.currentPath,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.state.searchQuery || '',
      prevPath: nextProps.currentPath,
    })
  }

  _handleSearchQueryChange(e) {
    let { value } = e.target
    this.setState({ value })

    if (!value) {
      Router.push('/', this.state.prevPath)
      this.setState({ prevPath: this.state.currentPath })
    }
  }

  _handleSearch(e) {
    e.preventDefault()

    const { value } = this.state

    if (value) {
      this.setState({ prevPath: this.props.currentPath })
      Router.push('/', `${this.props.currentPath}?q=${value}`)
    }
  }

  render() {
    return (
      <div className="search-container">
        <form onSubmit={this._handleSearch}>
          <input type="search"
            value={this.state.value}
            onChange={this._handleSearchQueryChange}
            onFocus={(e) => e.target.select()}
            placeholder="Search title, location, description..." />
        </form>
      </div>
    )
  }
}

Search.defaultProps = {
  value: ''
}

export default connect((state) => ({state}), {
  search
})(Search)
