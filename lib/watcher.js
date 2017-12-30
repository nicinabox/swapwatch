import axios from 'axios'
import camelCase from 'lodash/camelCase'
import { searchUrl } from './posts'
import toQuery from './toQuery'

const INTERVAL = 60000
const eventNames = ['before check', 'results', 'initial check']

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
    this.stop()

    this.timer = setTimeout(() => {
      fn()
    }, interval)
  }

  start() {
    if (!this.before) {
      this.onInitialCheck()
      this.check()
    }

    this.onBeforeCheck()

    this.delay(() => {
      this.check().then(() => {
        this.start()
      })
    })

    return this
  }

  check() {
    return this.fetch().then((data) => {
      this.onResults(data.children)
    })
  }

  restart() {
    this.stop()
    this.start()
  }

  stop() {
    clearTimeout(this.timer)
  }
}
