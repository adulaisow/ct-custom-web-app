import Constraints from '@commercetools-uikit/constraints';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import DataTable from '@commercetools-uikit/data-table';
import messages from './messages';
import {
  GRAPHQL_TARGETS,
} from '@commercetools-frontend/constants';
import { useHistory } from 'react-router-dom';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import FetchCustomersQuery from './fetch-customers.ctp.graphql';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';

const columns = [
  { key: 'title', label: 'Title', onClick: (e) => { console.log('e', e) } },
  { key: 'firstName', label: 'First name', onClick: (e) => { console.log('e', e) } },
  { key: 'middleName', label: 'Middle name', onClick: (e) => { console.log('e', e) } },
  { key: 'lastName', label: 'Last name', onClick: (e) => { console.log('e', e) } },
];

const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const Welcome = () => {
  const history = useHistory();

  const { data, error, loading } = useMcQuery(FetchCustomersQuery, {
    variables: {
      limit: 1,
      offset: 0,
      sort: ['key asc'],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <>
      <Constraints.Horizontal max={16}>
        <Spacings.Stack scale="xl">
          <Text.Headline as="h1" intlMessage={messages.title} />
        </Spacings.Stack>
      </Constraints.Horizontal>
      {loading && <LoadingSpinner />}
      {data?.customers &&
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columns}
            rows={data.customers.results}
            maxHeight={600}
            onRowClick={({ id }) => {
              history.push(`ct-custom-web-app/customers/${id}`);
            }}
          />
        </Spacings.Stack>
      }
    </>
  )
};

Welcome.displayName = 'Welcome';

export default Welcome;
