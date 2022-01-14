import {
  ApplicationShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import { Sdk } from '@commercetools-frontend/sdk';
import { handleActionError } from '@commercetools-frontend/actions-global';
import loadMessages from '../../load-messages';
import Welcome from '../welcome'

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

const EntryPoint = () => (
  <ApplicationShell
    environment={window.app}
    onRegisterErrorListeners={({ dispatch }) => {
      Sdk.Get.errorHandler = (error) => handleActionError(error)(dispatch);
    }}
    applicationMessages={loadMessages}
  >
    <Welcome />
  </ApplicationShell>
);

EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
