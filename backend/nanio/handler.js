'use strict';

module.exports.hello = async (event) => {
  if (event.path === '/whoami' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      body: JSON.stringify({
        username: 'cl2634'
      })
    }
  }
  if (event.path === '/feed' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      body: JSON.stringify(
        [{username: 'da335', message: 'building stuff is cool'}]
      )
    }
  }
  return {
    statusCode: 200,
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

  if (event.path === '/feed' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      body: JSON.stringify(
        [{username: 'cl2634', message: 'building stuff is cool'}]
      )
    }
  }

};

module.exports.orders = async (event) => {

  if (event.path === '/orders' && event.httpMethod === "GET" ){
    return {
      statusCode: 200,
      body: JSON.stringify(
        [{id: 'order-id', status: 'in-progress', total: '$50',menuItems: [{ name: 'fried chicken', quantity: 2 }]}]
      )
    }
  }

};