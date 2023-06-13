import { BrowserRouter } from 'react-router-dom';

export default function withRouter(component: () => JSX.Element) {
  return () => {
    return <BrowserRouter>{component()}</BrowserRouter>;
  };
}
