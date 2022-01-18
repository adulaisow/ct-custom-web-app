export default async (requestUrl, method, token, body) => {

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(requestUrl, requestOptions)

  if (response.status > 299) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }

  var content = await response.json()

  return content
}
