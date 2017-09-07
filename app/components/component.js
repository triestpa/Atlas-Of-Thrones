export class Component {
  constructor (placeholderId, template) {
    this.componentElem = document.getElementById(placeholderId)
    this.componentElem.innerHTML = template
  }
}
