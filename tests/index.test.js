const GenericHandler = require('../src/index')

test('GenericHandler constructor sets properties, getters and setters work', () => {
  const loadParametersPath = GenericHandler.prototype.loadParametersPath
  const loadEnvironment = GenericHandler.prototype.loadEnvironment
  const loadCredentialsPath = GenericHandler.prototype.loadCredentialsPath
  const loadDebug = GenericHandler.prototype.loadDebug
  GenericHandler.prototype.loadParametersPath = () => 'mockParametersPath'
  GenericHandler.prototype.loadEnvironment = () => 'mockEnvironment'
  GenericHandler.prototype.loadCredentialsPath = () => 'mockCredentialsPath'
  GenericHandler.prototype.loadDebug = () => 'mockDebug'
  const GenericService = new GenericHandler('mockEvent', 'mockContext', 'mockCallback')
  expect(GenericService.getEvent()).toEqual('mockEvent')
  expect(GenericService.getContext()).toEqual('mockContext')
  expect(GenericService.getCallback()).toEqual('mockCallback')
  expect(GenericService.getParametersPath()).toEqual('mockParametersPath')
  expect(GenericService.getEnvironment()).toEqual('mockEnvironment')
  expect(GenericService.getCredentialsPath()).toEqual('mockCredentialsPath')
  expect(GenericService.getDebug()).toEqual('mockDebug')
  expect(typeof GenericService.utilities).toEqual('object')
  GenericHandler.prototype.loadParametersPath = loadParametersPath
  GenericHandler.prototype.loadEnvironment = loadEnvironment
  GenericHandler.prototype.loadCredentialsPath = loadCredentialsPath
  GenericHandler.prototype.loadDebug = loadDebug
})

test('default serviceCall executes callback', (done) => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', () => { done() })
  GenericService.serviceCall()
})

test('loadEnvironment defaults to "development"', () => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', 'mockCallback')
  expect(GenericService.loadEnvironment()).toEqual('development')
})

test('loadCredentialsPath defaults to "./credentials"', () => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', 'mockCallback')
  expect(GenericService.loadCredentialsPath()).toEqual('./credentials')
})

test('loadParametersPath defaults to "./parameters"', () => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', 'mockCallback')
  expect(GenericService.loadParametersPath()).toEqual('./parameters')
})

test('loadDebug defaults to false', () => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', 'mockCallback')
  expect(GenericService.loadDebug()).toEqual(false)
})

test('errorResponse executes callback with the proper error object', (done) => {
  const GenericService = new GenericHandler('mockEvent', 'mockContext', (error) => {
    expect(error.status).toEqual(false)
    expect(error.error).toEqual('mockMessage')
    done()
  })

  GenericService.errorResponse({ message: 'mockMessage' })
})
