import React from 'react'
import { connect } from 'react-redux'
import Search from './Search'

export class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="row">
          <div className="flex-1">
            <a href="/" className="logo">
              Mechwatch
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Header)
