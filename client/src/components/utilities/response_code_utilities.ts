export function statusCodeOk(code: number, urlPath: string): boolean {
	if (code === 401 || code === 403) {
		manageUnAuthorizedRequset(urlPath)
		return true // We return true here since we manage the error ourselves
	}
	return code === 201 || code === 200
}

/**
 * If the request turns out to be unauthorized
 * we send the user to the login screen and then
 * back to the current screen when complete
 */
export function manageUnAuthorizedRequset(urlPath: string) {
	window.location.href = `/login?redirect=${urlPath}`
}