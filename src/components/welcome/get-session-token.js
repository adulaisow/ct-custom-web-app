import { actions } from '@commercetools-frontend/sdk';

export default async (dispatch) => {

  // Get session token
  const requestUrl = 'https://openam-specsavers-poc.forgeblocks.com/am/json/realms/root/authenticate'

  const topLevelRequestOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const userRequestBody = {
    authId: null,
    callbacks: [
      {
        type: 'NameCallback',
        output: [
          {
            name: 'prompt',
            value: 'User Name'
          }
        ],
        input: [
          {
            name: 'IDToken1',
            value: 'USERNAME'
          }
        ],
        _id: 0
      },
      {
        type: 'PasswordCallback',
        output: [
          {
            name: 'prompt',
            value: 'Password'
          }
        ],
        input: [
          {
            name: 'IDToken2',
            value: 'PASSWORD'
          }
        ],
        _id: 1
      }
    ]
  }

  const mfaPromptRequestBody = {
    authId: null,
    callbacks: [
      {
        type: 'TextOutputCallback',
        output: [
          {
            name: 'message',
            value: 'message'
          },
          {
            name: 'messageType',
            value: '0'
          }
        ]
      },
      {
        type: 'ConfirmationCallback',
        output: [
          {
            name: 'prompt',
            value: ''
          },
          {
            name: 'messageType',
            value: 0
          },
          {
            name: 'options',
            value: ['Set up']
          },
          {
            name: 'optionType',
            value: -1
          },
          {
            name: 'defaultOption',
            value: 0
          }
        ],
        input: [
          {
            name: 'IDToken2',
            value: 0
          }
        ]
      },
      {
        type: 'HiddenValueCallback',
        output: [
          {
            name: 'value',
            value: 'false'
          },
          {
            name: 'id',
            value: 'skip-input'
          }
        ],
        input: [
          {
            name: 'IDToken3',
            value: 'Skip'
          }
        ]
      },
      {
        type: 'TextOutputCallback',
        output: [
          {
            name: 'message',
            value:
              'var skipContainer = document.createElement("div");skipContainer.style = "width: 100%";skipContainer.innerHTML = "<button id=\'skip-link\' class=\'btn btn-block btn-link\' type=\'submit\'>Skip for now</button>";document.getElementById("skip-input").parentNode.append(skipContainer);document.getElementsByClassName("callback-component").forEach(  function (e) {    var message = e.firstElementChild;    if (message.firstChild && message.firstChild.nodeName == "#text" && message.firstChild.nodeValue.trim() == "message") {      message.align = "center";      message.innerHTML = "<h2 class=\'h2\'>Set up 2-step verification</h2><div style=\'margin-bottom:1em\'>Protect your account by adding a second step after entering your PASSWORD to verify it\'s you signing in.</div>";    }  })'
          },
          {
            name: 'messageType',
            value: '4'
          }
        ]
      },
      {
        type: 'TextOutputCallback',
        output: [
          {
            name: 'message',
            value:
              'document.getElementById("skip-link").onclick = function() {  document.getElementById("skip-input").value = "Skip";  document.getElementById("loginButton_0").click();  return false;}'
          },
          {
            name: 'messageType',
            value: '4'
          }
        ]
      }
    ]
  }

  try {
    // Get authId from Top-Level realm const authCodeResponse = await dispatch(
    debugger;
    const topLevelResponse = await dispatch(
      actions.forwardTo.post({
        uri: requestUrl,
        ...topLevelRequestOptions
      })
    )

    const topLevelAuthId = topLevelResponse.authId

    // Use authId and credentials to get a session token
    userRequestBody.authId = topLevelAuthId
    const userRequestOptions = {
      ...topLevelRequestOptions,
      payload: JSON.stringify(userRequestBody)
    }

    const userResponse = await dispatch(
      actions.forwardTo.post({
        uri: requestUrl,
        ...userRequestOptions
      })
    )

    // Use user authId to skip 2-step verification prompt
    const userAuthId = userResponse.authId

    mfaPromptRequestBody.authId = userAuthId
    const mfaPromptRequestOptions = {
      ...topLevelRequestOptions,
      payload: JSON.stringify(mfaPromptRequestBody)
    }

    const mfaPromptResponse = await dispatch(
      actions.forwardTo.post({
        uri: requestUrl,
        ...mfaPromptRequestOptions
      })
    )
    
    return Promise.resolve(mfaPromptResponse.authId)

    // const mfaPromptResponse = await fetch('https://mc-api.europe-west1.gcp.commercetools.com/proxy/forward-to', {
    //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Accept-version': 'v2',
    //     'X-Forward-To': requestUrl,
    //     'X-Project-Key': 'specsavers-ctp-uk-ci_001'
    //   },
    //   body: JSON.stringify(mfaPromptRequestBody)
    // });
      
    // if (mfaPromptResponse.status > 299) {
    //   console.log('Error while getting Session Token: mfa prompt')
    //   throw new Error(
    //     `${mfaPromptResponse.status}: ${mfaPromptResponse.statusText}`
    //   )
    // }


    // debugger;
    // return Promise.resolve(mfaPromptResponse.headers.get('set-cookie'))
  } catch (error) {
    debugger
    return Promise.reject(error)
  }
}
