const utilities = require('@source4society/scepter-utility-lib')
const getEnvironment = () => utilities.valueOrDefault(process.env.STAGE, 'development')
const getServicesPath = () => utilities.valueOrDefault(process.env.SERVICES_PATH, './services')
const getCredentialsPath = () => utilities.valueOrDefault(process.env.CREDENTIALS_PATH, './credentials')
const getParametersPath = () => utilities.valueOrDefault(process.env.PARAMETERS_PATH, './parameters')
const getServicePath = () => utilities.valueOrDefault(process.env.SERVICE_PATH, '../../../service')

// Standard useful utility functions
const createStandardErrorHandler = (callback, service) => (err) => { let response = service.prepareErrorResponse(err); callback(null, response) }
const createStandardSuccessHandler = (callback, service) => (responseData) => { let response = service.prepareSuccessResponse(responseData); callback(null, response) }
const constructServiceDefault = (servicePath, environment, credentialsPath, servicesPath, parametersPath) => {
  const Service = require(servicePath)
  return new Service(environment, credentialsPath, servicesPath, parametersPath)
}

const genericHandlerFunction = (
  event,
  context,
  injectedCallback,
  serviceCall,
  injectedServicePath,
  injectedConstructService,
  injectedEnv,
  injectedServicesPath,
  injectedCredentialsPath,
  injectedParametersPath,
  injectedCallbackHandler,
  injectedGetErrorHandlerDependency,
  injectedGetSuccessHandlerDependency
) => {
  // inject dependencies
  const callback = utilities.valueOrDefault(injectedCallback, context.done)
  const servicePath = utilities.valueOrDefault(injectedServicePath, getServicePath())
  const constructService = utilities.valueOrDefault(injectedConstructService, constructServiceDefault)
  const env = utilities.valueOrDefault(injectedEnv, getEnvironment())
  const servicesPath = utilities.valueOrDefault(injectedServicesPath, getServicesPath())
  const credentialsPath = utilities.valueOrDefault(injectedCredentialsPath, getCredentialsPath())
  const parametersPath = utilities.valueOrDefault(injectedParametersPath, getParametersPath())
  const callbackHandler = utilities.valueOrDefault(injectedCallbackHandler, utilities.standardCallbackHandler)
  const getErrorHandlerDependency = utilities.valueOrDefault(injectedGetErrorHandlerDependency, createStandardErrorHandler)
  const getSuccessHandlerDependency = utilities.valueOrDefault(injectedGetSuccessHandlerDependency, createStandardSuccessHandler)
  const service = constructService(servicePath, env, credentialsPath, servicesPath, parametersPath)
  const errorHandler = getErrorHandlerDependency(callback, service)
  const successHandler = getSuccessHandlerDependency(callback, service)

  try {
    serviceCall(service, callbackHandler, errorHandler, successHandler, event)
  } catch (error) {
    errorHandler(error)
  }
}

module.exports.constructServiceDefault = constructServiceDefault
module.exports.getEnvironment = getEnvironment
module.exports.getServicesPath = getServicesPath
module.exports.getCredentialsPath = getCredentialsPath
module.exports.getParametersPath = getParametersPath
module.exports.getServicePath = getServicePath
module.exports.genericHandlerFunction = genericHandlerFunction
module.exports.createStandardErrorHandler = createStandardErrorHandler
module.exports.createStandardSuccessHandler = createStandardSuccessHandler
