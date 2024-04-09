import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home'
import MoviesDetails from './screens/MoviesDetails';
import Footer from './components/Footer';
import WebseriesDetails from './screens/WebseriesDetails';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie/:id' element={<MoviesDetails />} />
        <Route path='/tv/:id' element={<WebseriesDetails />}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
