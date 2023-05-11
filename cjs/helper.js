const isRequestValid = (request, params) => {
    let missing = ""
    for (let param of params) {
        if (!request.hasOwnProperty(param)) missing += param + '\n'
    }
    return { 'isValid': (missing.length < 1), 'message': (missing).slice(0, -1) }		// accounting for trailing \n
}

module.exports = { isRequestValid }