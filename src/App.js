//import logo from './logo.svg';
import './App.css';
import Architect from './Architect';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Architect />
      </BrowserRouter>
    </div>
  );
}

export default App;
