/**
 * Perform a http request 
 * to a remote API 
 */

/*
example request
http({
    url: http://example.com
    method: "POST",
    headers: { "" }
})
*/

import queryString from 'querystring'

export interface HttpReturnType {
    status: number,
    url: string,
    ok: string,
    [key: string]: any
}

export default function http(data: any): Promise<HttpReturnType> {
    return new Promise(async resolve => {
        let bearer = undefined;
        if (data.auth !== undefined)
            bearer = { "Authorization": "Bearer " + data.auth }

        const headers = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            ...bearer,
            ...data.headers
        });
        let form = new FormData();

        for (let key in data.data) {
            if (data.data.hasOwnProperty(key)) {
                form.append(key, data.data[key]);
            }
        }

        let payload: RequestInit = {
            method: data.method,
            headers: headers,
            mode: 'cors',
        }
        if (data.method !== 'GET')
            payload.body = queryString.stringify(data.data);
        else {
            data.url += "?" + queryString.stringify(data.data);
            delete payload.body;
		}
		
        const result = await fetch(data.url, payload);

        let parsed = undefined;
        try {
            parsed = await result.json();
        } catch (error) {
            parsed = result;
        }

        resolve({ status: result.status, url: result.url, ok: result.ok, ...parsed});
    });
}