class HttpError extends Error {
  code: any;
  constructor (message, errorCode) {
    super(message)
    this.code = errorCode
  }
}

export default HttpError
