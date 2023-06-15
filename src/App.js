import MapPage from './Pages/MapPage/MapPage';
import BaseMap from "./Components/Map/base.map";
import About from './Pages/About/About';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
function App() {
  return (
      <>
          <BrowserRouter>
              <Routes>
                  <Route path={'/'} element={<About/>}/>
                  <Route path={'/map'} element={<MapPage/>}/>
                  <Route path={'/base'} element={<BaseMap/>}/>
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
