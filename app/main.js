import { ViewController } from './view'
require('./styles.scss')

const controller = new ViewController()
controller.loadMapData()

window.toggleInfo = controller.toggleInfo
window.toggleLayer = (layerName) => {
  console.log(layerName)
  controller.toggleLayer(layerName)
}
