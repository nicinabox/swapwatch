import css from 'next/css'

export default (rules) => {
  return Object.keys(rules).reduce((result, rule) => {
    return Object.assign(result, {
      [rule]: css(rules[rule])
    })
  }, {})
}
