

class Store {

    static types = {
        BACKGROUND: 'BACKGROUND',
        POPUP: 'POPUP',
        WEB: 'WEB',
        CONTENT: 'CONTENT'
    }

    static getType() {
        if (chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) return this.types.BACKGROUND;
        else if (chrome && chrome.extension && chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() !== window) return this.types.POPUP;
        else if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) return this.types.WEB;
        else return this.types.CONTENT;
    }

    static getInstance() {
        switch (this.getType()) {
            case this.types.BACKGROUND:
                return new ChromeExtensionStore();
            case this.types.POPUP:
                return new ChromeExtensionStore();
            case this.types.WEB:
                return new WebStore();
            case this.types.CONTENT:
                return new WebStore();
            default:
                throw new Error('Unknown store type');
        }
    }


    constructor() {
        this.isConfigured = false;
        this.baseUrl = null;
        this.token = null;
        this.userUrl = null;
    }

    async load() { throw new Error('Not implemented') }
    async save() { throw new Error('Not implemented') }
    async clear() { throw new Error('Not implemented') }
}


class ChromeExtensionStore extends Store {
    constructor() { super() }

    async load() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['isConfigured', 'baseUrl', 'userUrl', 'token'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    this.isConfigured = result.isConfigured;
                    this.baseUrl = result.baseUrl;
                    this.userUrl = result.userUrl;
                    this.token = result.token;
                    resolve(result);
                }
            });
        });
    }

    async save() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({
                isConfigured: this.isConfigured,
                baseUrl: this.baseUrl,
                userUrl: this.userUrl,
                token: this.token
            }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }

    async clear() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.clear(() => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }
}


class WebStore extends Store {
    constructor() { super() }

    async load() {
        return new Promise((resolve) => {
            const isConfigured = localStorage.getItem('isConfigured');
            const baseUrl = localStorage.getItem('baseUrl');
            const userUrl = localStorage.getItem('userUrl');
            const token = localStorage.getItem('token');

            this.isConfigured = isConfigured;
            this.baseUrl = baseUrl;
            this.userUrl = userUrl;
            this.token = token;

            resolve({ isConfigured, baseUrl, userUrl, token });
        });
    }

    async save() {
        return new Promise((resolve) => {
            localStorage.setItem('isConfigured', this.isConfigured);
            localStorage.setItem('baseUrl', this.baseUrl);
            localStorage.setItem('userUrl', this.userUrl);
            localStorage.setItem('token', this.token);
            resolve();
        });
    }

    async clear() {
        return new Promise((resolve) => {
            localStorage.removeItem('isConfigured');
            localStorage.removeItem('baseUrl');
            localStorage.removeItem('userUrl');
            localStorage.removeItem('token');
            resolve();
        });
    }
}

export default Store;