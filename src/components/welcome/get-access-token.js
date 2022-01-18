import { actions } from '@commercetools-frontend/sdk';

export default async (dispatch) => {
  try {
    // Get access token
    const accessTokenRequestUrl = 'https://openam-specsavers-poc.forgeblocks.com/am/oauth2/realms/root/realms/alpha/access_token?auth_chain=ClientCredentialsGrant'
      + '&grant_type=client_credentials'
      + '&scope=fr:idm:*'
      + '&client_id=CLIENT_ID'
      + '&client_secret=CLIENT_SECRET'

    const accessTokenResponse = await dispatch(
      // The URL to your external API
      actions.forwardTo.post({ 
        uri: accessTokenRequestUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
    )

    return Promise.resolve(accessTokenResponse.access_token)
  } catch (error) {
    return Promise.reject(error)
  }
}
