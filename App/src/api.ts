function getEnv(name: string) {
  let value = process.env[name]
  // console.log(process.env)
  if (!value) {
    let error = Error('missing environment variable: ' + name)
    document.body.innerText = error.message
    throw error
  }
  return value
}
//

export let API_ORIGIN: string = getEnv('REACT_APP_API_ORIGIN')

// export let FACEBOOK_APP_ID: string = getEnv('REACT_APP_FACEBOOK_APP_ID')

// export function post<T extends { error?: string }>(
//   url: string,
//   body: object,
//   cb: (json: T) => void,
// ): void {
//   fetch(API_ORIGIN + url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer ' + storages.token.getValue(),
//     },
//     body: JSON.stringify(body),
//   })
//     .then(res => res.json())
//     .catch(error => ({ error: String(error) }))
//     .then(cb)
// }
