import { useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom';
import { useMcMutation, useMcQuery } from '@commercetools-frontend/application-shell';
import FetchCustomerQuery from './fetch-customer.ctp.graphql';
import UpdateCustomerMutation from './update-customer.ctp.graphql';
import {
  GRAPHQL_TARGETS,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import { ContentNotification } from '@commercetools-uikit/notifications';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PrimaryButton from '@commercetools-uikit/primary-button';

const reducer = (state, action) => {
  switch(action.type) {
    case 'update':
      return {
        ...state,
        [action.key]: action.value
      }
    default:
      return state
  }
}

const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const labels = {
  title: 'Title',
  firstName: 'First Name',
  middleName: 'Middle Name',
  lastName: 'Last Name'
}

const Form = ({ data }) => {
  const fields = Object.entries(data)
    .filter(([key]) => {
      const excludes = ['id', 'version', '__typename'];
      return !excludes.includes(key)
    })

  const initialState = fields.reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value || ''
  }), {})

  const [version, setVersion] = useState(data.version)
  const [state, dispatch] = useReducer(reducer, initialState)

  const [updateCustomer] = useMcMutation(UpdateCustomerMutation);

  const handleSubmit = async () =>  {
    await updateCustomer({
      variables: {
        version: version,
        id: data.id,
        actions: [
          { setTitle: { title: state.title }},
          { setFirstName: { firstName: state.firstName }},
          { setMiddleName: { middleName: state.middleName }},
          { setLastName: { lastName: state.lastName }}
        ]
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    })

    setVersion(version + 1)
  }

  return (
    <>
      {fields.map(([key]) => (
        <TextField key={key} title={labels[key] || key} value={state[key]} onChange={(e) => {
          dispatch({
            type: 'update',
            key,
            value: e.target.value
          })
        }} />
      ))}
      <PrimaryButton 
        type="submit" 
        label="Submit" 
        onClick={ handleSubmit }
      />
    </>
  )
}

Form.propTypes = {
  data: PropTypes.object
}

Form.displayName = 'Form'

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
      {data?.customer && <Form data={data.customer} />}
    </>
  )
};

Customer.displayName = 'Customer';

export default Customer;
