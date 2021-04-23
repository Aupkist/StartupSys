'use strict';
const firebaseTokenVerifier = require('firebase-token-verifier')
const projectId = "nanio-4c0b0"
const headers = {
  'Access-Control-Allow-Origin': '*'
}
module.exports.hello = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // return the expected status and CORS headers
    return {
        statusCode: 200,
        headers
    }
}
  if (event.path === '/whoami' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        username: 'cl2634'
      })
    }
  }
  if (event.path === '/feed' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        [{username: 'da335', message: 'building stuff is cool'}]
      )
    }
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.feed = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // return the expected status and CORS headers
    return {
        statusCode: 200,
        headers
    }
}
  if (event.path === '/feed' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        [{username: 'cl2634', message: 'building stuff is cool'}]
      )
    }
  }

};

module.exports.orders = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // return the expected status and CORS headers
    return {
        statusCode: 200,
        headers
    }
}
  if (event.path === '/orders' && event.httpMethod === "GET" ){
    const token = event.headers['Authorization']
    // If no token is provided, or it is "", return a 401
    if (!token) {
      return {
        statusCode: 401,
        headers
      }
    }

    try {
      // validate the token from the request
      const decoded = await firebaseTokenVerifier.validate(token, projectId)
    } catch (err) {
      // the token was invalid,
      console.error(err)
      return {
        statusCode: 401,
        headers
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(
        [{id: 'order-id', status: 'in-progress', total: '$50',menuItems: [{ name: 'fried chicken', quantity: 2 }]},
        {id: '3', status: 'in-progress', total: '$10',menuItems: [{ name: 'veg', quantity: 1 }]}]
      )
    }
  }

};