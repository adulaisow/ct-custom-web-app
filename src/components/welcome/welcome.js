import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';

const Welcome = () => (
  <Constraints.Horizontal max={16}>
    <Spacings.Stack scale="xl">
      <Text.Headline as="h1" intlMessage={messages.title} />
    </Spacings.Stack>
  </Constraints.Horizontal>
);

Welcome.displayName = 'Welcome';

export default Welcome;
