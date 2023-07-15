import React from 'react';
import YouTrackAPI from '../../YouTrackAPI';


function Configure() {

    const baseUrlRef = React.useRef(null);
    const tokenRef = React.useRef(null);
    const userUrlRef = React.useRef(null);


    React.useEffect(() => {
        const { baseUrl, userUrl, token } = window.storage;

        if (baseUrl) baseUrlRef.current.value = baseUrl;
        if (userUrl) userUrlRef.current.value = userUrl;
        if (token) tokenRef.current.value = token;
    }, []);


    const doSaveConfig = async () => {



        const baseUrl = baseUrlRef.current.value;
        const userUrl = userUrlRef.current.value || baseUrl;
        const token = tokenRef.current.value;

        if (!baseUrl || !userUrl || !token) {
            if (!baseUrl) baseUrlRef.current.classList.add('border-red-500');
            if (!userUrl) userUrlRef.current.classList.add('border-red-500');
            if (!token) tokenRef.current.classList.add('border-red-500');
        } else {
            baseUrlRef.current.classList.remove('border-red-500');
            userUrlRef.current.classList.remove('border-red-500');
            tokenRef.current.classList.remove('border-red-500');
        }

        let urlObj = null;
        try {
            urlObj = new URL(baseUrl);
        } catch (err) {
            alert('Invalid YouTrack URL');
            return;
        }

        // check if we have permission to call baseUrl 
        const granted = await new Promise((resolve, reject) => {
            try {
                if (!chrome || !chrome?.permissions?.request) resolve(true);
                else {
                    chrome?.permissions?.request({
                        origins: [urlObj.href + '*']
                    }, resolve);
                }
            } catch (err) { reject(err) }
        })

        if (!granted) return alert('Permission denied. Please allow the extension to access YouTrack.');

        // test connection
        try {
            const yt = new YouTrackAPI({ baseUrl, token, userUrl });
            const account = await yt.getCurrentUser();

            if (!account) {
                alert('Connection failed. Please check your configuration.');
                return;
            }

            // save config
            window.storage.baseUrl = urlObj.origin;
            window.storage.userUrl = userUrl;
            window.storage.token = token;
            window.storage.isConfigured = true;
            await window.storage.save();

            // reload
            window.location = window.location.origin + '/index.html'
        } catch (err) {
            alert(err);
            return;
        }
    }


    return (
        <>
            <section className="p-4">
                <h3 className="text-2xl font-bold text-center mb-5 text-gray-600 dark:text-white">Configuration</h3>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">YouTrack URL <span className="text-red-500 text-sm text-bold">*</span></label>
                    <input ref={baseUrlRef} placeholder="https://my-youtrack-instance.youtrack.cloud" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <small className="text-gray-500 text-xs">
                        This is the URL you use to access YouTrack
                    </small>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">YouTrack Token <span className="text-red-500 text-sm text-bold">*</span></label>
                    <input ref={tokenRef} placeholder="perm:xxxxxxx.xxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <small className="text-gray-500 text-xs">
                        Profile &gt; Account Security &gt; Tokens &gt; Click "New Token"
                    </small>
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">YouTrack Access URL</label>
                    <input ref={userUrlRef} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <small className="text-gray-500 text-xs">
                        Ignore this if you use the same URL for API and User Login
                    </small>
                </div>

                <button onClick={doSaveConfig} className={"p-4 w-full bg-green-600 text-white font-bold py-2 px-4 rounded" + (true ? ' hover:bg-green-700 ' : ' opacity-50 cursor-not-allowed')}> Save </button>

            </section>
        </>
    );
}

export default Configure;
