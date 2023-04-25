import path from 'path'
import { ProductCode } from './types'

class Utils {
  static getOutputFileInfo({
    directory,
    date,
    productCode,
  }: {
    directory: string
    date: Date
    productCode: ProductCode
  }) {
    const filename = Utils.generateFilename({ date, productCode })
    const fullPath = path.resolve(directory, filename)

    return { filename, fullPath }
  }

  static generateFilename({
    date,
    productCode,
  }: {
    date: Date
    productCode: ProductCode
  }) {
    const year = String(date.getFullYear())
    const month = this.prependZero({
      str: String(date.getMonth() + 1),
      targetLength: 2,
    })
    const day = this.prependZero({
      str: String(date.getDate()),
      targetLength: 2,
    })

    return `${year}${month}${day}-${productCode}.json`
  }

  static getProductInfoJsonUrl(productCode: string) {
    return `http://www.uniqlo.com/tw/data/products/prodInfo/zh_TW/${productCode}.json`
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private static prependZero({
    str,
    targetLength,
  }: {
    str: string
    targetLength: number
  }) {
    const numOfZero = Math.max(targetLength - str.length, 0)
    return `${new Array(numOfZero).fill('0').join('')}${str}`
  }
}

export default Utils
