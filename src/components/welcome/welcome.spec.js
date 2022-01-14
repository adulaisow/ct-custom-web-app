import {
  renderApp,
  screen
} from '@commercetools-frontend/application-shell/test-utils';
import Welcome from './';

it('should render welcome page', async () => {
  renderApp(<Welcome />);
  await screen.findByText('Welcome.title');
});
