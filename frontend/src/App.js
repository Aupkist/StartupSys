import logo from './CROWD.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
