import React from 'react'
import { connect } from 'react-redux'

export class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="row">
          <div className="flex-1">
            <a href={`/${this.props.state.subreddit}`} className="logo">
              SwapWatch
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({state}))(Header)
