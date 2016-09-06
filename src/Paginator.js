import React, { Component, PropTypes } from 'react'
import range from 'lodash/range'

export default class Paginator extends Component {
  static propTypes = {
    initialPage: props => {
      if (typeof props.initialPage !== 'number') {
        return new Error(`initialPage should be a number`)
      }
      if (props.initialPage < 1) {
        return new Error('initialPage should be greater than or equal to 1')
      }
      if (props.initialPage > props.numberOfPages) {
        return new Error(
          `initialPage should be less than or equal to ${props.numberOfPages}`
        )
      }
    },
    numberOfPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    children: PropTypes.func.isRequired
  }

  static defaultProps = { initialPage: 1 }

  state = { page: this.props.initialPage }

  getPageRange = (offset = 3) => {
    if (typeof offset !== 'number') {
      throw new Error('offset should be a number')
    }
    const start = this.state.page - offset
    const end = this.state.page + offset
    return range(
      start > 1 ? start : 1,
      (end < this.props.numberOfPages ? end : this.props.numberOfPages) + 1
    )
  }

  setPage = page => {
    if (typeof page !== 'number') {
      throw new Error('page should be a number')
    }
    if (page < 1) {
      throw new Error('page should be greater than or equal to 1')
    }
    if (page > this.props.numberOfPages) {
      throw new Error(
        `page should be less than or equal to ${this.props.numberOfPages}`
      )
    }
    this.setState({ page }, () => {
      if (this.props.onPageChange) {
        this.props.onPageChange(page)
      }
    })
  }

  incrementPage = () => {
    if (this.state.page === this.props.numberOfPages) {
      return
    }
    this.setPage(this.state.page + 1)
  }

  decrementPage = () => {
    if (this.state.page === 1) {
      return
    }
    this.setPage(this.state.page - 1)
  }

  render() {
    return this.props.children({
      ...this.state,
      getPageRange: this.getPageRange,
      setPage: this.setPage,
      incrementPage: this.incrementPage,
      decrementPage: this.decrementPage
    })
  }
}