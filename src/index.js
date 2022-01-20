const fetch = (...args) => import('node-fetch')
              .then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': event.headers.origin,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    // CORS
    if (event.headers.origin != 'http://localhost:3000' && event.headers.origin != 'https://requests.auth.party') {
        return {
            statusCode: 403,
            body: {
                success: false,
                error: 'Forbidden',
            }
        }
    }

    if (event.requestContext.http.method == 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
        }
    }
    
    if (!event.body) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: 'Missing body',
            }),
        }
    }

    const body = JSON.parse(event.body);

    const timeStart = new Date().getTime(); // Unix timestamp in milliseconds
    const rdata = await fetch(body.url || `https://api64.ipify.org/?format=json`, {
        method: body.method || 'GET',
        headers: body.headers || {
            'User-Agent': 'AuthPartyProxyClient'
        },
        body: body.body || null,
    })
    const timeEnd = new Date().getTime(); // Unix timestamp in milliseconds
    
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            data: {
                status: rdata.status,
                statusText: rdata.statusText,
                headers: rdata.headers.raw(),
                body: await rdata.text(),
                redirect: rdata.redirected,
                took: timeEnd - timeStart,
            }
        } || {}),
    };
};
