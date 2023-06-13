import ReactDOM from 'react-dom/client';
import App from './app/index.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store/index.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
