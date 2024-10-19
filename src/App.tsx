import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { generateIntegrationFunction } from './services/ia.toolkit';

function App() {
  const [senderCode, setSenderCode] = useState('');
  const [receiverCode, setReceiverCode] = useState('');
  const [resultCode, setResultCode] = useState('');
  const [context, setContext] = useState('');

  const handleGenerate = async () => {
    try {
      const result = await generateIntegrationFunction(senderCode, receiverCode, context);
      setResultCode(result);
    } catch (error) {
      console.error(error);
      alert('Error al generar el código');
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <textarea placeholder='Ingresa el context' onChange={(e) => setContext(e.target.value)}></textarea>
        <textarea
          placeholder="Código del contrato Sender"
          value={senderCode}
          onChange={(e) => setSenderCode(e.target.value)}
        />
        <textarea
          placeholder="Código del contrato Receiver"
          value={receiverCode}
          onChange={(e) => setReceiverCode(e.target.value)}
        />
        <button onClick={handleGenerate}>Generar Código</button>
        <h3>Código Resultante:</h3>
        <pre>{resultCode}</pre>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
