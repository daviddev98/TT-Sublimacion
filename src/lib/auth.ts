export const DEMO_CREDENTIALS = {
  username: "tt",
  password: "sublimacion",
}

export const SESSION_COOKIE = "tt_session"

export function credentialsMatch(username: string, password: string) {
  return (
    username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  )
}
