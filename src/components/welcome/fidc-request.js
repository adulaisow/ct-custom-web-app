import { actions } from '@commercetools-frontend/sdk';

export default async (dispatch, requestUrl, method, token, body) => {

  const requestOptions = {
    payload: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const response = await dispatch(
    // The URL to your external API
    actions.forwardTo[method]({ uri: requestUrl, ...requestOptions })
  )

  if (response.status > 299) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }

  return response
}
