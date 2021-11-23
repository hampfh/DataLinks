import { useLocation } from "react-router";

export default function useStatusCodeEvaluator() {
	const location = useLocation()
	
	/**
	 * Evaluates whether a statusCode should be considered
	 * as successful. If request has failed then it will
	 * act on this by sending the user to login
	 */
	function actOnFailedRequest(statusCode: number, forceReloadOnFail = true): boolean {
		if (statusCode === 401 || statusCode === 403) {
			window.location.href = `/login?redirect=${location.pathname}`
			return false
		} else if (statusCode !== 201 && statusCode !== 200 && forceReloadOnFail) 
			window.location.reload()
		return statusCode !== 201 && statusCode !== 200
	}

	return { actOnFailedRequest }
}
