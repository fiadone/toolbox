/**
 * @module generators
 * @package @fiad/toolbox/share-manager
 * @description A collection of share url generators
 */

import QueryString from '../utils/query-string'
import { retrieveMetaData } from './helpers'

const META_DATA = retrieveMetaData()

/**
 * Whatsapp share link generator
 * @param {object} data The data to be shared
 */
export function whatsapp(data) {
  const { url, description } = { ...META_DATA, ...data }
  const text = description ? `${description} ${url}` : url
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Telegram share link generator
 * @param {object} data The data to be shared
 */
export function telegram(data) {
  const { url, description } = { ...META_DATA, ...data }
  const queryString = `?url=${url}&text=${description}`
  return `https://telegram.me/share/url${encodeURIComponent(queryString)}`
}

/**
 * Facebook share link generator
 * @param {object} data The data to be shared
 */
export function facebook(data) {
  const { url } = { ...META_DATA, ...data }
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

/**
 * Twitter share link generator
 * @param {object} data The data to be shared
 */
export function twitter(data) {
  const { url, description } = { ...META_DATA, ...data }
  const status = description ? `${url} ${description}` : url
  return `https://twitter.com/home?status=${encodeURIComponent(status)}`
}

/**
 * Google+ share link generator
 * @param {object} data The data to be shared
 */
export function googleplus(data) {
  const { url } = { ...META_DATA, ...data }
  return `https://plus.google.com/share?url=${encodeURIComponent(url)}`
}

/**
 * LinkedIn share link generator
 * @param {object} data The data to be shared
 */
export function linkedin(data) {
  const { url, title, description } = { ...META_DATA, ...data }
  const queryString = `?mini=true&url=${url}&title=${title}&summary=${description}`
  return `https://www.linkedin.com/shareArticle${encodeURIComponent(queryString)}`
}

/**
 * Mail share link generator
 * @param {object} data The data to be shared
 */
export function mail(data) {
  const { url, title, description } = { ...META_DATA, ...data }
  const body = description ? `${url} ${description}` : url
  return `mailto:?subject=${title}&body=${body}`
}

/**
 * Custom share link generator
 * @param {object} data The data to be shared
 */
export function custom({ baseUrl, ...data } = {}) {
  if (!baseUrl) {
    return
  }

  return `${baseUrl}${QueryString.fromObject({ ...META_DATA, ...data })}`
}
