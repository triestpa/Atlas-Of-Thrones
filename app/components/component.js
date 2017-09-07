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

  createEvents (events) {
    Object.keys(events).forEach((eventName) => {
      this.componentElem.addEventListener(eventName, events[eventName], false)
    })
  }

  triggerEvent (eventName, detail) {
    const event = new window.CustomEvent(eventName, { detail })
    this.componentElem.dispatchEvent(event)
  }
}
