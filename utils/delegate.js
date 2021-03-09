/**
 * Event delegation handler
 * @param {string} selector The selector of elements to delegate the event to
 * @param {function} fn The handler to be delegated
 */
export default function delegate(selector, fn) {
  if (typeof selector !== 'string') return fn

  return function(e) {
    const target = e.target.closest(selector)
    if (!target) return
    fn(e, target)
  }
}
