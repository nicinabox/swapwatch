export default (category, query) => {
  let flair = category
    ? 'flair:' + JSON.stringify(category)
    : null

  return [flair, query].filter(f => f).join(' ')
}
