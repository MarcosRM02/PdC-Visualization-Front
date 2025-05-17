import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios
  .get<{ csrfToken: string }>('/authentication/csrf-token')
  .then(({ data }) => {
    //sessionStorage.setItem('csrfToken', data.csrfToken);
    axios.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
  });

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </BrowserRouter>,
  );
}
