import './App.css';
import Authentication from './routes/authentication/authentication.component';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='auth' element={<Authentication/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
