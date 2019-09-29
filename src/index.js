const SCEPTERUtils = require('@source4society/scepter-utility-lib')

class GenericHandler {
  constructor (event, context, callback) {
    // inject dependencies
    this.utilities = new SCEPTERUtils()
    this.setCallback(callback)
    this.setEvent(event)
    this.setContext(context)
    this.setEnvironment(this.loadEnvironment())
    this.setCredentialsPath(this.loadCredentialsPath())
    this.setParametersPath(this.loadParametersPath())
    this.setDebug(this.loadDebug())
  }

  getEvent () {
    return this.event
  }

  getContext () {
    return this.context
  }

  getCallback () {
    return this.callback
  }

  getEnvironment () {
    return this.environment
  }

  getCredentialsPath () {
    return this.credentialsPath
  }

  getParametersPath () {
    return this.parametersPath
  }

  getDebug () {
    return this.debug
  }

  setEvent (event) {
    this.event = event
  }

  setContext (context) {
    this.context = context
  }

  setCallback (callback) {
    this.callback = callback
  }

  setEnvironment (environment) {
    this.environment = environment
  }

  setCredentialsPath (credentialsPath) {
    this.credentialsPath = credentialsPath
  }

  setParametersPath (parametersPath) {
    this.parametersPath = parametersPath
  }

  setDebug (debug) {
    this.debug = debug
  }

  // To be overriden by child
  serviceCall () {
    this.getCallback()(null, this.successResponse(null))
  }

  loadEnvironment () {
    return this.utilities.valueOrDefault(process.env.STAGE, 'development')
  }

  loadCredentialsPath () {
    return this.utilities.valueOrDefault(process.env.CREDENTIALS_PATH, './credentials')
  }

  loadParametersPath () {
    return this.utilities.valueOrDefault(process.env.PARAMETERS_PATH, './parameters')
  }

  loadDebug () {
    return this.utilities.valueOrDefault(process.env.DEBUG, false)
  }

  errorResponse (error) {
    const message = this.utilities.ifTrueElseDefault(this.debug, error.stack, error.message)
    const response = {
      status: false,
      error: this.utilities.valueOrDefault(message, error)
    }
    this.callback(response)
  }

  successResponse (data) {
    const response = {
      status: true,
      result: data
    }
    this.callback(null, response)
  }
}

module.exports = GenericHandler
