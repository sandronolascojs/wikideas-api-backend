export class FilterQueries {
  query = []
  receivedParams = []

  constructor (receivedParams, query) {
    this.receivedParams = receivedParams
    this.query = query
  }

  static validate (receivedParams, query = []) {
    const filterQueries = new FilterQueries(receivedParams, query)
    const keysOfreceivedParams = Object.values(filterQueries.receivedParams)
    const keysOfquery = Object.keys(filterQueries.query)
    const extraParams = []
    keysOfquery.forEach(key => {
      if (!keysOfreceivedParams.includes(key)) extraParams.push(key)
    })
    if (extraParams.length > 0) return { error: `Extra params: ${extraParams.join(', ')}` }
  }
}
