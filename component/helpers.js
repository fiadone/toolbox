import { uncapitalize } from '../utils/string'
import Component from './'

/**
 * Attaches components to DOM elements
 * @param {object} components The components mapping object
 * @param {(Document|Element)} root The components root element
 * @returns {object} The component instances collection
 */
export function attach(components = {}, root = document) {
  const instances = {}

  root.querySelectorAll('[data-component]').forEach(el => {
    const { component: name } = el.dataset
    const component = name ? components[name] : null

    if (!component || (!(component.prototype instanceof Component) && !component.handler)) return

    let C = component
    let props = {}
    let key = uncapitalize(name)

    if (!(C.prototype instanceof Component)) {
      const { key: alias, handler, ...rest } = component
      C = handler
      props = rest

      if (alias) {
        key = alias
      }
    }

    const instance = new C(el, props)

    if (instances.hasOwnProperty(key)) {
      if (Array.isArray(instances[key])) {
        instances[key].push(instance)
      } else {
        instances[key] = [instances[key], instance]
      }
    } else {
      instances[key] = instance
    }
  })

  return instances
}

/**
 * Detaches components from DOM elements
 * @param {object} components The component instances map
 */
export function detach(components = {}) {
  Object.entries(components).forEach(([key, component]) => {
    if (Array.isArray(component)) {
      component.forEach(entry => {
        try { entry.destroy() } catch {}  
      })
    } else {
      try { component.destroy() } catch {}
    }
    delete components[key]
  })
}
