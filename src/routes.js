import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Customer from './components/customer';
import Welcome from './components/welcome';

const ApplicationRoutes = () => {
  const match = useRouteMatch();

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/customers/:customerId`}>
          <Customer />
        </Route>
        <Route>
          <Welcome />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};

ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;