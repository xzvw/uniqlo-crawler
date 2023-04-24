import fs from 'fs'
import productCodeList from './productCodeList'
import Utils from './Utils'

const endpointUrl = (productCode: string) =>
  `http://www.uniqlo.com/tw/data/products/prodInfo/zh_TW/${productCode}.json`

const date = new Date()

async function main() {
  const productsOnSell: Array<Record<string, any>> = []

  // @todo
  // If `./json` directory doesn't exist, then create it.

  for (const productCode of productCodeList) {
    const filename = Utils.generateFilename({ date, productCode })
    const fullPath = `./json/${filename}`

    if (fs.existsSync(fullPath)) {
      console.log(`${filename} exists, continue`)
      continue
    }

    fetch(endpointUrl(productCode))
      .then((res) => res.json())
      .then((json) => {
        fs.writeFileSync(fullPath, JSON.stringify(json, null, 2))
        console.log(`Write ${filename}`)

        const { name, originPrice, minPrice, maxPrice } = json
        if (originPrice !== minPrice || originPrice !== maxPrice) {
          productsOnSell.push({
            name,
            productCode,
            originPrice,
            minPrice,
            maxPrice,
          })
        }
      })

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('--- productsOnSell ---')
  console.log(JSON.stringify(productsOnSell, null, 2))
}

main()
