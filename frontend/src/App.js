import logo from './CROWD.png';
import './App.css';
// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
 
// Configure Firebase.
var firebaseConfig = {
  apiKey: "AIzaSyBMcOoAyFEAcy5xN6H6iWVl-qA_7GTVJlY",
  authDomain: "nanio-4c0b0.firebaseapp.com",
  projectId: "nanio-4c0b0",
  storageBucket: "nanio-4c0b0.appspot.com",
  messagingSenderId: "1087403262812",
  appId: "1:1087403262812:web:7d11778788457e5897b799"
};

firebase.initializeApp(firebaseConfig);
//var config = require('./api.json');
class Orders extends React.Component {
  state = {
    orders: null
  }

  async componentDidMount() {
    
    // const response = await fetch('https://oymckezqe4.execute-api.us-east-1.amazonaws.com/dev/orders')
    // const orders = await response.json()
    // save it to your components state so you can use it during render
    // this.setState({orders: orders})
    // console.log(orders)
    const idToken = await firebase.auth().currentUser?.getIdToken()
    const response = await fetch('http://localhost:4000/dev/orders', {
    //const response = await fetch('https://oymckezqe4.execute-api.us-east-1.amazonaws.com/dev/orders', {
      headers: {
        'Authorization': idToken
      }
    })
    if (response.status === 401) {
      return console.log('unauthorized')
    }
    const orders = await response.json()
    // save it to your components state so you can use it during render
    this.setState({orders: orders})
    console.log("wtf",orders)
  }
  render() {
    return (
      
                
    <div>
    {console.log("PLEASE", this.state.orders)}
    <div className="title">My Orders</div>
    
      <ul>
      
      {
        
        this.state.orders && this.state.orders.Items.map((orders,index) =>  {
          
          return (
            <li key={index}>
              <div>
                <p class = "title is-4">Order ID: {orders.id}</p>
                <p class = "subtitle is-6">Order status: {orders.status}</p>
              </div>
            </li>
          )
        })
        
      }
      
    </ul>
  </div>
    )  
  }
    
}
class SignedInComponent extends React.Component {
  state = {
		orders: null,
		newOrder: null,
    newQuantity: null
	}

	async fetchOrders() {
    const token = await firebase.auth().currentUser?.getIdToken()
		const results = await fetch('http://localhost:4000/dev/orders', {
			headers: {
				'Authorization': token
			}
		 })
     const data = await results.json()
		this.setState({ orders: data })
	}

	componentDidMount() {
    this.fetchOrders()
	}

	onNewOrderUpdated(event) {
		this.setState({newOrder: event.target.value})

	}
	onNewQuantityUpdated(event) {
		this.setState({newQuantity: event.target.value})

	}
	async createOrder() {
		const token = await firebase.auth().currentUser?.getIdToken()

		// Make a POST request to your new API
		const response = await fetch('http://localhost:4000/dev/orders', {
			method: 'POST',
			headers: {
				'Authorization': token
			},

			// Include the data you want to save in the body of the request
			// as a JSON string
			body: JSON.stringify({
				//orderId: uuiv(),
        Quantity: this.state.newQuantity,
        Item: this.state.newOrder
			})
		})

		// After the request is made, get all the users chatrooms again
		// which will now include the newest one

	}

	render() {
			return (
				<div>
					<div class="title">My Orders</div>
					  <ul>
						{/* Show all the users chatrooms if they have any */}
						{this.state.orders && this.state.orders.Items.map(order => {
							return(             
              <li>
              <div>
                <p class = "title is-4">Item: {order.Item}</p>
                <p class = "subtitle is-6">Quantity: {order.Quantity}</p>
              </div>
            </li>
              )
						})}
					  </ul>
					<div>
						<div class="title">Create an Order</div>

						{/* Use an input field with an onChange handler */}
						<input type="text" onChange={(event) => this.onNewOrderUpdated(event)}></input>
            <input type="text" onChange={(event) => this.onNewQuantityUpdated(event)}></input>
						{/* Use a button with an onClick handler to create */}
						<button onClick={() => this.createOrder()}>Create</button>
					</div>
				</div>
			)
	}
}
class SignInScreen extends React.Component {
 
  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  };
  
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };
 
  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user})
    );
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
 
  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>Crowd</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div>
        <h1>Crowd</h1>
        <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
        <p> E-mail: {firebase.auth().currentUser.email}   </p>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        <Orders />
        <SignedInComponent />

      </div>
    );
  }
}





function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <SignInScreen />
        
        <p>
          About
        </p>
        <p>
          test
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Start using Crowd!
        </a>
        <button> Sign up! </button>
      </header>
    </div>
  );


}

export default App;
