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
import getAccessToken from './get-access-token'
import fidcRequest from './fidc-request';
import { useState, useEffect } from 'react';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';

const columns = [
  { key: 'title', label: 'Title', onClick: (e) => { console.log('e', e) } },
  { key: 'firstName', label: 'First name', onClick: (e) => { console.log('e', e) } },
  { key: 'middleName', label: 'Middle name', onClick: (e) => { console.log('e', e) } },
  { key: 'lastName', label: 'Last name', onClick: (e) => { console.log('e', e) } },
];

const columnsFr = [
  { key: '_id', label: 'ID', onClick: (e) => { console.log('e', e) } },
  { key: 'mail', label: 'Email', onClick: (e) => { console.log('e', e) } },
  { key: 'givenName', label: 'Last Name', onClick: (e) => { console.log('e', e) } },
];

const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const Welcome = () => {
  const history = useHistory();
  const dispatch = useAsyncDispatch();

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

  const [ usersFr, setUsersFr ] = useState(null);
  const loadingUsers = true

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken(dispatch)

      const requestUrl = 'https://openam-specsavers-poc.forgeblocks.com/openidm/managed/alpha_user?' +
        `_queryFilter=true&_fields=givenName&_fields=_id&_fields=mail&_pagesize=10`

      const response = await fidcRequest(dispatch, requestUrl, 'get', accessToken)

      loadingUsers = false
      setUsersFr(response.result)
    })() 
  }, []);
  

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
        </Spacings.Stack  >
      }

      {loadingUsers && <LoadingSpinner />}
      {usersFr &&
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columnsFr}
            rows={usersFr}
            maxHeight={600}
          />
        </Spacings.Stack  >
      }
    </>
  )
};

Welcome.displayName = 'Welcome';

export default Welcome;
