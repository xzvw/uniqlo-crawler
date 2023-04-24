class Utils {
  static prependZero({
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
