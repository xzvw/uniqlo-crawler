import fs from 'fs'
import productCodeList from './productCodeList'

const addLeadingZero = (str: string, targetLen = 2) => {
  const numOfZero = Math.max(targetLen - str.length, 0)
  return `${new Array(numOfZero).fill('0').join('')}${str}`
}

const endpointUrl = (productCode: string) =>
  `http://www.uniqlo.com/tw/data/products/prodInfo/zh_TW/${productCode}.json`

const date = new Date()
const year = String(date.getFullYear())
const month = addLeadingZero(String(date.getMonth() + 1))
const day = addLeadingZero(String(date.getDate()))

async function main() {
  const productsOnSell: Array<Record<string, any>> = []

  // @todo
  // If `./json` directory doesn't exist, then create it.

  for (const productCode of productCodeList) {
    const filename = `${year}${month}${day}-${productCode}.json`
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
