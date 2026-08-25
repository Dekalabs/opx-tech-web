class BaseTransformer {
  static receiveCollection(items) {
    return items ? items.map(item => this.fetch(item)) : []
  }

  static sendCollection(items) {
    return items.map(item => this.send(item))
  }
}

export default BaseTransformer
