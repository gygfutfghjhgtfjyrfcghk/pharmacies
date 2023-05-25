import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import PharmacySearch from './components/PharmacySearch/PharmacySearch'
import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <div className="App">
      <Header/>
      <PharmacySearch />
      <Footer/>
    </div>
  );
}

export default App;
