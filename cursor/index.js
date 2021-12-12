/**
 * @module Cursor
 * @package @fiad/toolbox
 * @description A performing custom cursor handler
 */

import Component from '../component'
import Store from '../store'
import debounce from '../utils/debounce'
import gsap from 'gsap'

class Cursor extends Component {
  /**
   * Global cursor's state manager
   * @private
   * @static
   * @type {Store}
   */
  static #store = new Store({
    coords: { x: 0, y: 0 },
    visible: false,
    holding: false,
    target: null
  })

  /**
   * Global cursor's enabling state
   * @private
   * @static
   * @type {boolean}
   */
  static #initialized = false

  /**
   * Retrieves pointer coordinates from the given event and normalizes them to make mouse and touch homogeneous
   * @param {Event} e The mouse/touch event
   * @returns {object} The normalized pointer coordinates
   */
  static #normalizeEventCoords(e) {
    const { clientX: x, clientY: y } = (e.type.indexOf('touch') >= 0)
      ? (e.touches[0] || e.changedTouches[0])
      : e

    return { x, y }
  }

  /**
   * Global mouse/touch move handler
   * @private
   * @static
   * @param {Event} e The mouse/touch event
   */
  static #onMove(e) {
    Cursor.#store.set({
      coords: Cursor.#normalizeEventCoords(e),
      visible: true
    })
  }

  /**
   * Global mouse enter handler
   * @private
   * @static
   */
  static #onEnter() {
    Cursor.#store.set('visible', true)
  }

  /**
   * Global mouse/touch leave handler
   * @private
   * @static
   */
  static #onLeave() {
    Cursor.#store.set({
      visible: false,
      target: null
    })
  }

  /**
   * Global mouse over handler
   * @private
   * @static
   * @param {Event} e The mouse event
   */
  static #onOver(e) {
    Cursor.#store.set('target', e.target)
  }

  /**
   * Global mouse/touch down handler
   * @private
   * @static
   */
  static #onDown() {
    Cursor.#store.set('holding', true)
  }

  /**
   * Global mouse/touch up handler
   * @private
   * @static
   */
  static #onUp() {
    Cursor.#store.set('holding', false)
  }

  /**
   * Global cursor state getter
   * @static
   * @param {any[]} args
   * @returns {object} The current cursor state
   */
  static get(...args) {
    return Cursor.#store.get(...args)
  }

  /**
   * Initializes the global cursor instance
   * @static
   */
  static init() {
    if (Cursor.#initialized) return

    window.addEventListener('mousemove', Cursor.#onMove)
    window.addEventListener('touchmove', Cursor.#onMove)
    document.addEventListener('mouseenter', Cursor.#onEnter)
    document.addEventListener('mouseleave', Cursor.#onLeave)
    document.addEventListener('touchleave', Cursor.#onLeave)
    document.addEventListener('mousedown', Cursor.#onDown)
    document.addEventListener('touchstart', Cursor.#onDown)
    document.addEventListener('mouseup', Cursor.#onUp)
    document.addEventListener('touchend', Cursor.#onUp)
    document.addEventListener('mouseover', Cursor.#onOver)
  }

  /**
   * Destroys the global cursor instance
   * @static
   */
  static destroy() {
    if (!Cursor.#initialized) return

    window.removeEventListener('mousemove', Cursor.#onMove)
    window.removeEventListener('touchmove', Cursor.#onMove)
    document.removeEventListener('mouseenter', Cursor.#onEnter)
    document.removeEventListener('mouseleave', Cursor.#onLeave)
    document.removeEventListener('touchleave', Cursor.#onLeave)
    document.removeEventListener('mousedown', Cursor.#onDown)
    document.removeEventListener('touchstart', Cursor.#onDown)
    document.removeEventListener('mouseup', Cursor.#onUp)
    document.removeEventListener('touchend', Cursor.#onUp)
    document.removeEventListener('mouseover', Cursor.#onOver)
  }

  /**
   * The list of the cursor's default triggers
   * @type {Array}
   */
  static defaultTriggers = ['a', 'button']

  /**
   * The default cursor props
   * @type {object}
   */
  static defaultProps = { origin: [0.5, 0.5], inertia: 0.2 }

  /**
   * @constructor
   * @param {Element} el The custom cursor element
   * @param {object} props The cursor props
   */
  constructor(el, props) {
    super(el, { ...Cursor.defaultProps, ...props })

    this.coords = null

    this.#setup(() => {
      window.addEventListener('resize', this.#onResize)
      Cursor.#store.observe('coords', this.#init)
      Cursor.init()
    })
  }

  /**
   * Basic cursor styles setter
   * @private
   * @param {function} callback A function to call on setup completion
   */
  #setup = callback => {
    const { origin, z = 9999 } = this.props

    gsap.set(this.root, {
      position: 'fixed',
      top: 0,
      left: 0,
      xPercent: 100 * -origin[0],
      yPercent: 100 * -origin[1],
      zIndex: z,
      pointerEvents: 'none',
      onComplete: (typeof callback === 'function') ? callback : null
    })
  }

  /**
   * Resize event handler
   * @private
   */
  #onResize = debounce(this.#setup, 300)

  /**
   * Updates the cursor element visibility state
   * @param {boolean} visible The current global cursor visibility state
   */
  #toggleVisibility = visible => {
    if (visible) {
      this.show()
    } else {
      this.hide()
    }
  }

  /**
   * Updates the cursor element holding state
   * @param {boolean} holding The current global cursor holding state
   */
  #toggleHolding = holding => {
    if (holding) {
      this.hold()
    } else {
      this.release()
    }
  }

  /**
   * Handles the update of the cursor element position
   */
  #requestMoveFrame = () => {
    const coords = Cursor.#store.get('coords')
    const { inertia } = this.props
    const withInertia = this.coords && typeof inertia === 'number' && inertia > 0 && inertia < 1

    this.move(coords, withInertia ? inertia : false)
  }

  /**
   * Handles the update of the cursor hover state according to the event target match test
   * @param {(Element|HTMLDocument|null)} target The mouse/touch event target
   */
  #checkTarget = target => {
    const { triggers = Cursor.defaultTriggers } = this.props
    const selectors = triggers.join(', ')
    const trigger = target ? (target.matches(selectors) || target.closest(selectors)) : null

    this.hover(trigger)
  }

  /**
   * Initializes cursor
   * @param {object} coords The initial cursor coords
   */
  #init = coords => {
    if (!Cursor.#store.get('visible')) {
      return
    }

    Cursor.#store.unobserve('coords', this.#init)
    Cursor.#store.observe('visible', this.#toggleVisibility)
    Cursor.#store.observe('holding', this.#toggleHolding)
    Cursor.#store.observe('target', this.#checkTarget)

    this.move(coords, false, debounce(() => {
      gsap.ticker.add(this.#requestMoveFrame)
      this.show()
    }, 10))
  }

  /**
   * Adds the data-cursor-visible attribute to the cursor element
   */
  show = () => {
    this.root.setAttribute('data-cursor-visible', '')

    if (typeof this.props.onShow === 'function') {
      this.props.onShow()
    }
  }

  /**
   * Removes the data-cursor-visible attribute from the cursor element
   */
  hide = () => {
    this.root.removeAttribute('data-cursor-visible')

    if (typeof this.props.onHide === 'function') {
      this.props.onHide()
    }
  }

  /**
   * Updates the cursor element position
   * @param {object} coords The coords to move the cursor to
   * @param {(number|boolean)} inertia The linear interpolation factor
   * @param {function} callback A function to call on position update
   */
  move = (coords, inertia, callback) => {
    if (typeof coords !== 'object'
      || !coords.hasOwnProperty('x')
      || !coords.hasOwnProperty('y')) return

    this.coords = {
      x: inertia ? gsap.utils.interpolate(this.coords.x, coords.x, inertia) : coords.x,
      y: inertia ? gsap.utils.interpolate(this.coords.y, coords.y, inertia) : coords.y
    }

    gsap.set(this.root, {
      ...this.coords,
      force3D: true,
      onComplete: (typeof callback === 'function') ? callback : null,
      onCompleteParams: [this.coords]
    })

    if (typeof this.props.onMove === 'function') {
      this.props.onMove(this.coords)
    }
  }

  /**
   * Adds/removes the data-cursor-hover attribute to/from the cursor element
   * @param {(string|null)} trigger The hover trigger
   */
  hover = trigger => {
    if (trigger) {
      this.root.setAttribute('data-cursor-hover', trigger)
    } else {
      this.root.removeAttribute('data-cursor-hover')
    }

    if (typeof this.props.onHover === 'function') {
      this.props.onHover(trigger)
    }
  }

  /**
   * Adds the data-cursor-hold attribute to the cursor element
   */
  hold = () => {
    this.root.setAttribute('data-cursor-hold', '')

    if (typeof this.props.onHold === 'function') {
      this.props.onHold()
    }
  }

  /**
   * Removes the data-cursor-hold class from the cursor element
   */
  release = () => {
    this.root.removeAttribute('data-cursor-hold')

    if (typeof this.props.onRelease === 'function') {
      this.props.onRelease()
    }
  }

  /**
   * Destroys the cursor instance
   */
  destroy() {
    gsap.set(this.root, { clearProps: 'position, top, left, z-index, transform, pointer-events' })
    gsap.ticker.remove(this.#requestMoveFrame)

    window.removeEventListener('resize', this.#onResize)

    Cursor.#store.unobserve('visible', this.#toggleVisibility)
    Cursor.#store.unobserve('holding', this.#toggleHolding)
    Cursor.#store.unobserve('target', this.#checkTarget)

    if (typeof this.props.onDestroy === 'function') {
      this.props.onDestroy()
    }
  }
}

export default Cursor
