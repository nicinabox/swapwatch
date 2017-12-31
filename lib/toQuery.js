export default (category, query) => {
  let flair = category && category !== 'All'
    ? 'flair:' + JSON.stringify(category)
    : null

  return [flair, query].filter(f => f).join(' ')
}
