/**
 * Retrieves data from sharing-oriented meta tags
 * @returns {object} The collection of the retrieved values
 */
export function retrieveMetaData() {
  const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"'))
  const metaData = ogTags.reduce((acc, metaTag) => {
    const [_, key] = metaTag.getAttribute('property').split(':')
    acc[key] = metaTag.getAttribute('content')
    return acc
  }, {})

  if (!metaData.hasOwnProperty('title')) {
    const titleMetaTag = document.querySelector('title')
    metaData.title = titleMetaTag ? titleMetaTag.innerText : ''
  }

  if (!metaData.hasOwnProperty('description')) {
    const descriptionMetaTag = document.querySelector('meta[name="description"]')
    metaData.description = descriptionMetaTag ? descriptionMetaTag.getAttribute('content') : ''
  }

  if (!metaData.hasOwnProperty('url')) {
    metaData.url = window.location.href
  }

  return metaData
}
