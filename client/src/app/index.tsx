import './index.scss';
import Routing from '@/pages';
import withRouter from './providers/withRouter';
import './index.scss';

function App() {
  return (
    <>
      <Routing></Routing>
    </>
  );
}

export default withRouter(App);
