import { Component, PropTypes } from 'react'
import isEqual from 'lodash/isEqual'
import axios from 'axios'

const http = axios.create()

export default class Fetch extends Component {
  static propTypes = {
    method: PropTypes.oneOf(['get', 'post', 'put', 'delete']),
    url: PropTypes.string.isRequired,
    params: PropTypes.object,
    headers: PropTypes.object,
    body: PropTypes.object,
    lazy: PropTypes.bool,
    onResponse: PropTypes.func,
    onData: PropTypes.func,
    onError: PropTypes.func,
    children: PropTypes.func.isRequired
  }

  static defaultProps = { method: 'get' }

  static setBaseUrl = baseUrl => http.defaults.baseURL = baseUrl

  static setAuthorization = authorization => {
    http.defaults.headers.common['Authorization'] = authorization
  }

  state = { fetching: false, response: null, data: null, error: null }

  componentDidMount() {
    if (!this.props.lazy) {
      this.fetch()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.lazy && !isEqual(this.props, nextProps)) {
      this.fetch()
    }
  }

  componentWillUnmount() {
    this.willUnmount = true
  }

  fetch = (body = this.props.body) => {
    return new Promise((resolve, reject) => {
      this.setState({ fetching: true }, () => {
        http.request({
          method: this.props.method,
          url: this.props.url,
          params: this.props.params,
          headers: this.props.headers,
          data: body
        }).then(response => {
          if (this.willUnmount) {
            return
          }
          this.setState({ fetching: false, response, data: response.data }, () => {
            if (this.props.onResponse) {
              this.props.onResponse(response)
            }
            if (this.props.onData) {
              this.props.onData(this.state.data)
            }
            resolve(this.state.data)
          })
        }).catch(error => {
          if (this.willUnmount) {
            return
          }
          if (!error.response) {
            throw new Error(
              `${error.message} on ${this.props.method.toUpperCase()} ${this.props.url}`
            )
          }
          this.setState({
            fetching: false,
            response: error.response,
            error: error.response.data
          }, () => {
            if (this.props.onResponse) {
              this.props.onResponse(error.response)
            }
            if (this.props.onError) {
              this.props.onError(this.state.error)
            }
            reject(this.state.error)
          })
        })
      })
    })
  }

  render() {
    return this.props.children({
      fetching: this.state.fetching,
      response: this.state.response,
      data: this.state.data,
      error: this.state.error,
      fetch: this.fetch
    })
  }
}
