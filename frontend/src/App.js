import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx'
import MoviesDetails from './screens/MoviesDetails.jsx';
import Footer from './components/Footer.jsx';
import WebseriesDetails from './screens/WebseriesDetails.jsx';
import PersonDetails from './screens/PersonDetails.jsx';
import Login from './screens/Login.jsx';
import Signup from './screens/Signup.jsx';
import GenreMovies from './screens/GenreMovies.jsx';
import Webseries from './screens/Webseries.jsx';
import WebSeasons from './screens/WebSeasons.jsx';
import ScrollToTop from 'react-scroll-to-top'
import Userprofile from './screens/Userprofile.jsx';
import { useSelector } from 'react-redux';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

function App() {

  const {authUser} = useSelector(store => store.user)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path={`/user/${authUser?.fullname}`} element={<Userprofile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact-us' element={<Contact />} />
        <Route path='/series' element={<Webseries />} />
        <Route path='/movie/:id' element={<MoviesDetails />} />
        <Route path='/genre/:id' element={<GenreMovies />} />
        <Route path='/series/:id' element={<WebseriesDetails />} />
        <Route path='/series/:id/season/:sn' element={<WebSeasons />} />
        <Route path='/person/:id' element={<PersonDetails />} />
      </Routes>
      <ScrollToTop color='black' width='1.2rem' smooth title='move to top'   />
      <Footer />
    </Router>
  );
}

export default App;
