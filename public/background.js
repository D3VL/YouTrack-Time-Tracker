chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // proxy for fetch requests
    if (request.type === 'fetch') {
        fetch(request.url, request.options).then((response) => {
            if (!response.ok) {
                sendResponse({ error: response.statusText });
            } else {
                response.json().then((json) => { sendResponse({ response: json }) }).catch((error) => { sendResponse({ error: error.message }) });
            }
        }).catch((error) => {
            sendResponse({ error: error.message });
        });

        return true;
    }
});