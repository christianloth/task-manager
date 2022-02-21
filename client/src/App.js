import logo from './logo.svg';
import './App.css';

function App() {
  const testServer = () => {
    fetch('http://localhost:3001/')
    .then(res => res.json())
    .then(data => console.log(data));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={testServer}>
          Click Me!
        </button>
      </header>
    </div>
  );
}

export default App;
