test('Environment variable values are set to defaults', () => {
  delete process.env.stage
  delete process.env.SERVICE_PATH
  delete process.env.CREDENTIALS_PATH
  delete process.env.PARAMETERS_PATH
  Object.keys(require.cache).forEach((key) => delete require.cache[key])
  const getEnvironment = require('../index').getEnvironment
  const getServicePath = require('../index').getServicePath
  const getCredentialsPath = require('../index').getCredentialsPath
  const getParametersPath = require('../index').getParametersPath
  const getServicesPath = require('../index').getServicesPath
  expect(getEnvironment()).toEqual('dev')
  expect(getServicePath()).toEqual('../../../service')
  expect(getServicesPath()).toEqual('./services')
  expect(getCredentialsPath()).toEqual('./credentials')
  expect(getParametersPath()).toEqual('./parameters')
})

test('Generic handler function constructs service class', (done) => {
  const genericHandlerFunction = require('../index').genericHandlerFunction
  const mockConstructService = (servicePath, env, credentialsPath, servicesPath, parametersPath) => {
    expect(servicePath).toEqual('testservice')
    expect(env).toEqual('test')
    expect(credentialsPath).toEqual('testcredentials')
    expect(servicesPath).toEqual('testservices')
    expect(parametersPath).toEqual('testparameters')
    done()
    const MockServiceClass = class {}
    return new MockServiceClass()
  }

  genericHandlerFunction(
    {},
    null,
    null,
    null,
    'testservice',
    mockConstructService,
    'test',
    'testservices',
    'testcredentials',
    'testparameters',
    null,
    () => () => null,
    () => () => null
  )
})

test('Generic handler function handles error when thrown by service', (done) => {
  const genericHandlerFunction = require('../index').genericHandlerFunction
  const mockServiceCall = () => { throw new Error('test error') }
  const mockConstructService = () => null
  const mockErrorHandler = () => (error) => {
    expect(error.message).toEqual('test error')
    done()
  }
  genericHandlerFunction(
    {},
    null,
    null,
    mockServiceCall,
    'testservice',
    mockConstructService,
    'test',
    'testservices',
    'testcredentials',
    'testparameters',
    null,
    mockErrorHandler,
    () => () => null
  )
})

test('service constructor requires service class and returns constructed class', () => {
  const MockClass = require('./mock')
  const constructService = require('../index').constructServiceDefault
  const mockClass = constructService('./test/mock')
  expect(mockClass).toBeInstanceOf(MockClass)
})

test('Test that standard error handler uses the service to prepare an error response and sends it into the success side of callback', (done) => {
  const createStandardErrorHandler = require('../index').createStandardErrorHandler
  const mockService = {
    prepareErrorResponse: (error) => new Error(error)
  }

  const mockCallback = (error, response) => {
    expect(error).toBeNull()
    expect(response.message).toEqual('test error')
    done()
  }

  createStandardErrorHandler(mockCallback, mockService)('test error')
})

test('Test that the standard success response generates a success message using the service and sends it to the success side of callback', (done) => {
  const createStandardSuccessHandler = require('../index').createStandardSuccessHandler
  const mockService = {
    prepareSuccessResponse: (responseData) => ({ body: responseData })
  }

  const mockCallback = (error, response) => {
    expect(error).toBeNull()
    expect(response.body).toEqual('data goes here')
    done()
  }

  createStandardSuccessHandler(mockCallback, mockService)('data goes here')
})
