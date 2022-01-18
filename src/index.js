const fetch = (...args) => import('node-fetch')
              .then(({default: fetch}) => fetch(...args));


exports.handler = async (event) => {
    // CORS
    if (event.requestContext.http.method == 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://requests.auth.party',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    }
    
    // TODO implement
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                success: false,
                message: 'Missing body',
            }),
        }
    }

    const body = JSON.parse(event.body);

    const rdata = await fetch(body.url || `https://auth.party/example`, {
        method: body.method || 'GET',
        headers: body.headers || {
            'User-Agent': 'AuthPartyProxyClient'
        },
        body: body.body || null,
    })
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            event,
            success: true,
            data: {
                status: rdata.status,
                headers: rdata.headers,
                body: await rdata.text(),
                redirect: rdata.redirected,
                size: rdata.bodyUsed ? rdata.bodyUsed.size : 0,
            }
        } || {}),
    };
};
