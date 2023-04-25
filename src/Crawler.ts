import fs from 'fs'
import path from 'path'
import config from './config'
import productCodeList from './productCodeList'
import { ProductInformation } from './types'
import Utils from './Utils'

const date = new Date()

class Crawler {
  static async start() {
    this.prepareOutputDirectory()

    const productsOnSell: Array<ProductInformation> = []

    for (const productCode of productCodeList) {
      const filename = Utils.generateFilename({ date, productCode })
      const fullPath = path.resolve(config.outputDirectory, filename)

      if (fs.existsSync(fullPath)) {
        console.log(`${filename} exists, continue`)
        continue
      }

      const productInfo = await this.fetchProductInfo(productCode)

      fs.writeFileSync(fullPath, JSON.stringify(productInfo, null, 2))
      console.log(`Write ${filename}`)

      const { name, originPrice, minPrice, maxPrice } = productInfo
      if (originPrice !== minPrice || originPrice !== maxPrice) {
        productsOnSell.push({
          productCode,
          name,
          originPrice,
          minPrice,
          maxPrice,
        })
      }

      await Utils.sleep(1000)
    }

    console.log('--- productsOnSell ---')
    console.log(JSON.stringify(productsOnSell, null, 2))
  }

  private static prepareOutputDirectory() {
    if (!fs.existsSync(config.outputDirectory)) {
      fs.mkdirSync(config.outputDirectory)
    }
  }

  private static fetchProductInfo(productCode: string) {
    return fetch(Utils.getProductInfoJsonUrl(productCode)).then((res) =>
      res.json()
    )
  }
}

export default Crawler
