/**
 * Splits given string into an array of words
 * @private
 * @param {string} string The string to be splitted
 * @param {function} filter A function that applies a transformation to each word
 * @returns {Array} The array of the words composing the original string
 */
export function words(string, filter) {
  const words = string.split(' ').map(word => word.trim())
  return (typeof filter === 'function') ? words.map(filter) : words
}

/**
 * Splits given string into an array of characters
 * @private
 * @param {string} string The string to be splitted
 * @param {boolean} groupByWords Defines if chars should be grouped by word
 * @param {function} filter A function that applies a transformation to each character
 * @returns {Array} The array of the characters composing the original string
 */
export function chars(string, groupByWords, filter) {
  const handler = (typeof filter !== 'function')
    ? word => word.split('').map(char => char.trim()).map(filter)
    : word => word.split('').map(char => char.trim())
  const chars = words(string, handler)
  return groupByWords ? chars : chars.flat()
}

/**
 * Makes the first letter of the given string uppercase
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * capitalize('my string') --> 'My String'
 */
export function capitalize(string) {
  return words(string, word => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ')
}

/**
 * Makes the first letter of the given string lowercase
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * uncapitalize('My PascalCase String') --> 'my pascalCase string'
 */
export function uncapitalize(string) {
  return words(string, word => (word.charAt(0).toLowerCase() + word.slice(1))).join(' ')
}

/**
 * Rewrites the given string in camel-case
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * camelCase('my string') --> 'myString'
 */
export function camelCase(string) {
  return words(string, (word, i) => (i > 0) ? capitalize(word) : uncapitalize(word)).join('')
}

/**
 * Rewrites the given string in pascal-case
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * pascalCase('my string') --> 'MyString'
 */
export function pascalCase(string) {
  return capitalize(camelCase(string))
}

/**
 * Rewrites the given string in snake-case
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * snakeCase('my string') --> 'my_string'
 */
export function snakeCase(string) {
  return words(string, word => word.toLowerCase()).join('_')
}

/**
 * Rewrites the given string in kebab-case
 * @param {string} string The string to be transformed
 * @returns {string} The transformed string
 * @example
 * kebabCase('my string') --> 'my-string'
 */
export function kebabCase(string) {
  return words(string, word => word.toLowerCase()).join('-')
}
