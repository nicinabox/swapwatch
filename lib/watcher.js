import axios from 'axios'
import camelCase from 'lodash/camelCase'
import searchUrl from './searchUrl'
import toQuery from './toQuery'

const INTERVAL = 60000 * 5
const eventNames = ['before fetch', 'results', 'initial fetch']

export default class Watcher {
  constructor(props) {
    this.flair = props.flair
    this.term = props.term
    this.subreddit = props.subreddit
    this.interval = props.interval || INTERVAL
    this.before = props.before
    this.events = {}

    eventNames.forEach((event) => {
      const method = camelCase(`on ${event}`)
      this.events[event] = () => {}
      this[method] = (data) => this.events[event](data)
    })
  }

  fetch() {
    const url = searchUrl(this.subreddit, {
      raw_json: 1,
      sort: 'new',
      restrict_sr: 'on',
      before: this.before,
      q: toQuery(this.flair, this.term)
    })

    return axios.get(url)
      .then(({data}) => {
        if (data.data.children.length) {
          this.before = data.data.children[0].data.name
        }

        this.onResults(data.data.children)

        return data.data
      })
      .catch((err) => {
        console.error(err)
        throw err
      })
  }

  on(event, callback) {
    this.events[event] = callback
    return this
  }

  delay(fn, interval = this.interval) {
    this.timerId = setTimeout(() => fn(), interval)
    return this
  }

  start() {
    if (this.timerId) {
      this.stop()
    }

    if (!this.before) {
      this.onInitialFetch()
      this.fetch()
    }

    this.onBeforeFetch()

    return this.delay(() => {
      this.fetch().then(() => {
        this.start()
      })
    })
  }

  stop() {
    clearTimeout(this.timerId)
    this.timerId = null
  }

  restart() {
    this.stop()
    this.start()
  }
}
