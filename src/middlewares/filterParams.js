
export class FilterParams {
  body = []
  requiredParams = []

  constructor (requiredParams, body, optionalParams = []) {
    this.requiredParams = requiredParams
    this.body = body
  }

  static validate (requiredParams, body, optionalParams = []) {
    const filterParams = new FilterParams(requiredParams, body, optionalParams)
    const keysOfRequiredParams = Object.values(filterParams.requiredParams)
    const keysOfOptionalParams = Object.values(optionalParams)
    const keysOfBody = Object.keys(filterParams.body)
    const missedParams = []
    const extraParams = []
    keysOfRequiredParams.forEach(key => {
      if (!keysOfBody.includes(key)) missedParams.push(key)
    })
    keysOfBody.forEach(key => {
      if (!keysOfRequiredParams.includes(key) && !keysOfOptionalParams.includes(key)) extraParams.push(key)
    })
    if (keysOfBody.length === 0) return { error: 'Body is empty' }
    if (missedParams.length > 0) return { error: `Missed params: ${missedParams.join(', ')}` }
    if (extraParams.length > 0) return { error: `Extra params: ${extraParams.join(', ')}` }
  }
}
