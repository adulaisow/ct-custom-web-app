import { useParams } from 'react-router-dom';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import FetchCustomerQuery from './fetch-customer.ctp.graphql';
import {
  GRAPHQL_TARGETS,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';

const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const Customer = () => {
  const { customerId } = useParams()
  
  const { data, error, loading } = useMcQuery(FetchCustomerQuery, {
    variables: {
      id: customerId
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
      {loading && <LoadingSpinner />}
      {data?.customer ? Object.entries(data.customer)
        .filter(([key]) => {
          const excludes = ['id', '__typename'];
          return !excludes.includes(key)
        })
        .map(([key, value]) => (
          <TextField key={key} title={key} value={value} onChange={(event) => alert(event)} />
        )) : null}
    </>
  )
};

Customer.displayName = 'Customer';

export default Customer;
