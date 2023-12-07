import './App.css';
import Calculator from './components/calculator';
import { Typography } from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <Typography variant='h2'>BODMAS Calculator</Typography>
     <Calculator/>
    </div>
  );
}

export default App;
