# scepter-handlerutilities-lib
Utilities for universal serverless handler functions

## How to use

This utility library is intended to be used in conjunction with the [SCEPTER Framework](https://github.com/sourc e4societyorg/SCEPTER-Core) although it can be used independently with the [Serverless Framework](https://www.serverless.com) to standardize handling of errors.

You can include this library in your project via `npm install @source4society/scepter-handlerutilities-lib` (or using yarn if you prefer) if you are not using SCEPTER, otherwise it comes already included in your project.

The generic and standard handlers takes care of errors and successful responses by mapping the outcome to specific service class methods defined by you in your services `service.js` file. These methods generate the appropriate response which then is passed into the callback provided by your cloud services provider. Now when implementing specific cloud functions, they can be defined with a smaller amount of code. For example, if I wanted to invoke the hello method of a given service I could do so as follows:

    module.exports.hello = (event, context, callback, injectedHandler) => {
      genericHandler = utilities.valueOrDefault(injectedHandler, genericHandlerFunction)
      genericHandler(event, context, callback, (service, callbackHandler, errorHandler, successHandler, eventData) =>
        service.hello((err, data) => callbackHandler(err, data, errorHandler, successHandler)
        )
      )
    }

Whereas the hello method might be defined in the service class as:

    hello () {
      return 'hello world'
    }

    prepareErrorResponse (error) {    
      return {
        status: false,
        error: error
      }
    }

    prepareSuccessResponse (data) {
      return {
        status: true,
        result: data
      }
    }

