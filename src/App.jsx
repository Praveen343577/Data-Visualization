// src/App.jsx
import { LiveBarChartContainer } from './components/charts/LiveBarChartContainer';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617',
      padding: '24px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: '600px',
      }}>
        <LiveBarChartContainer />
      </div>
    </div>
  );
}

export default App;