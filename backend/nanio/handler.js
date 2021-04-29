'use strict';
const firebaseTokenVerifier = require('firebase-token-verifier')
const projectId = "nanio-4c0b0"
const headers = {
  'Access-Control-Allow-Origin': '*'
}
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

// const getRestaurants = (zipCode) => {  
//   return docClient    
//   .query({
//     TableName: "cs5356-restaurants",
//     KeyConditionExpression: "zipCode = :zipCode",
//     ExpressionAttributeValues: {
//       ":zipCode": zipCode,      
//       },
//     })
//     .promise()
//     .then((results) => results.Items);
// };
// const addRestaurant = (restaurant) => {
// return docClient
// .put({
//     TableName: "cs5356-restaurants",
//     Item: {        
//       zipCode: restaurant.zipCode,        
//       restaurantId: restaurant.name,        
//       menu: restaurant.menu,      
//     },    
//   })    
//   .promise();};

// const placeOrder = (userKey, orderDetails) => {
//   return docClient
//   .put({
//     TableName: "cs5356-restaurants",      
//     Item: {        
//       userKey: userKey,        
//       orderId: uuidv4(),        
//       total: orderDetails.total,        
//       items: orderDetails.items      
//     },    
//   })    
//   .promise();
// };

//   const getOrders = (userKey) => {  
//     return docClient    
//     .query({      
//       TableName: "cs5356-restaurants",      
//       KeyConditionExpression: "user_key = :user_key",      
//       ExpressionAttributeValues: {        
//         ":user_key": userKey,      
//       },    
//     })    
//     .promise()    
//     .then((results) => results.Items);
// };
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
const checkUser = async (event) => {
  const token = event.headers['Authorization']
    if (!token) {
      throw new Error('Missing token')
    }
    const decodedUser = await firebaseTokenVerifier.validate(token, projectId)
    return decodedUser
}
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
    let user
    try {
      // validate the token from the request
      user = await firebaseTokenVerifier.validate(token, projectId)
    } catch (err) {
      // the token was invalid,
      console.error(err)
      return {
        statusCode: 401,
        headers
      }
    }
    const results = await docClient.query({
      TableName: 'cs5356-restaurants',
          KeyConditionExpression: 'userKey = :userKey',
          ExpressionAttributeValues: {
            ':userKey': user.sub,
      }
      }).promise()
  
    //return that data
      return {
        statusCode: 201,
          headers,
      body: JSON.stringify(results)
    // return {
    //   statusCode: 200,
    //   headers,
    //   body: JSON.stringify(
    //     [{id: 'order-id', status: 'in-progress', total: '$50',menuItems: [{ name: 'fried chicken', quantity: 2 }]},
    //     {id: '3', status: 'in-progress', total: '$10',menuItems: [{ name: 'veg', quantity: 1 }]}]
    //   )
     }
  }
  if (event.path === '/orders' && event.httpMethod === 'POST') {
    // check if the user is authenticated
    const token = event.headers['Authorization']
	let user;
    try {
      user = await checkUser(event)
    } catch (err) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({message: err.message})
      }
    }

    // check that the request contains a body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({message: 'Missing body'})
      }
    }

    // parse the request body as JSON
    const requestBody = JSON.parse(event.body);

    // TODO write that data to your dynamodb table
    await docClient.put({
      TableName: 'cs5356-restaurants',
        Item: {
          orderId: uuidv4(),
          userKey: user.sub,
          Quantity: requestBody.Quantity,
          Item: requestBody.Item
      }
    }).promise()
    return {
      statusCode: 201,
        headers,
	// send back a successful response

	  }
  }

};