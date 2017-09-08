/**
 * Base component class to provide view ref binding, template insertion, and event listener setup
 */
export class Component {
  constructor (placeholderId, template, events) {
    this.componentElem = document.getElementById(placeholderId)

    if (template) {
      // Load template into placeholder element
      this.componentElem.innerHTML = template

      // Find all refs in component
      this.refs = {}
      const refElems = this.componentElem.querySelectorAll('[ref]')
      refElems.forEach((elem) => { this.refs[elem.getAttribute('ref')] = elem })
    }

    if (events) { this.createEvents(events) }
  }

  /** Read "event" component parameters, and attach event listeners for each */
  createEvents (events) {
    Object.keys(events).forEach((eventName) => {
      this.componentElem.addEventListener(eventName, events[eventName], false)
    })
  }

  /** Trigger a component event with the provided "detail" payload */
  triggerEvent (eventName, detail) {
    const event = new window.CustomEvent(eventName, { detail })
    this.componentElem.dispatchEvent(event)
  }
}
