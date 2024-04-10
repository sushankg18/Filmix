import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home'
import MoviesDetails from './screens/MoviesDetails';
import Footer from './components/Footer';
import WebseriesDetails from './screens/WebseriesDetails';
import PersonDetails from './screens/PersonDetails';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie/:id' element={<MoviesDetails />} />
        <Route path='/tv/:id' element={<WebseriesDetails />}/>
        <Route path='/person/:id' element={<PersonDetails />}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
