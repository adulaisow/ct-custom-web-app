import base64url from 'base64url'
import { v4 as uuidv4 } from 'uuid'
import { actions } from '@commercetools-frontend/sdk';
import sha256 from 'crypto-js/sha256';
import getSessionToken from './get-session-token';

export default async (dispatch) => {
  try {
    // Get session token
    const sessionToken = await getSessionToken(dispatch)

    // Get authorization code
    const codeVerifier = base64url(uuidv4())
    const codeChallenge = base64url(sha256(codeVerifier))

    const authCodeRequestParams = new URLSearchParams()
    authCodeRequestParams.append('redirect_uri', 'https://openam-specsavers-poc.forgeblocks.com/platform/appAuthHelperRedirect.html')
    authCodeRequestParams.append('scope', 'fr:idm:*')
    authCodeRequestParams.append('response_type', 'code')
    authCodeRequestParams.append('client_id', 'idmAdminClient')
    authCodeRequestParams.append('code_challenge', codeChallenge)
    authCodeRequestParams.append('code_challenge_method', 'S256')

    const authCodeRequestUrl = 'https://openam-specsavers-poc.forgeblocks.com/am/oauth2/authorize?' + authCodeRequestParams.toString()
    
    const authCodeResponse = await dispatch(
      // The URL to your external API
      actions.forwardTo.get({
        uri: authCodeRequestUrl,
        headers: {
          '28eca2c519470fe': sessionToken
        }
      })
    )

    const authCode = authCodeResponse.url.match('.*?code=([^&]+).*')[1]

    // Get access token
    const accessTokenRequestUrl = 'https://openam-specsavers-poc.forgeblocks.com/am/oauth2/access_token'
    const accessTokenRequestBody = new URLSearchParams()
    accessTokenRequestBody.append('redirect_uri', 'https://openam-specsavers-poc.forgeblocks.com/platform/appAuthHelperRedirect.html')
    accessTokenRequestBody.append('grant_type', 'authorization_code')
    accessTokenRequestBody.append('client_id', 'idmAdminClient')
    accessTokenRequestBody.append('code', authCode)
    accessTokenRequestBody.append('code_verifier', codeVerifier)

    const accessTokenResponse = await dispatch(
      // The URL to your external API
      actions.forwardTo.post({ 
        uri: authCodeRequestUrl,
        payload: accessTokenRequestBody
      })
    )

    return Promise.resolve(accessTokenResponse.access_token)
  } catch (error) {
    return Promise.reject(error)
  }
}
