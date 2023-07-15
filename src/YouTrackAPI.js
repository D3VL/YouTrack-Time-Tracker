class YouTrackAPI {

    constructor({
        baseUrl,
        token,
        userUrl
    }) {
        this.baseUrl = baseUrl;
        this.userUrl = userUrl || baseUrl;
        this.token = token;
        this.currentUser = null;
    }

    #checkConfig = async () => {
        if (!this.baseUrl || !this.token) throw new Error('YouTrack API is not configured');
    }

    #fetch = async (url, _options = {}, headers = {}) => {
        const options = {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${this.token}`,
                ...headers
            },
            ..._options
        }


        // if we are in a chrome extension, use the background page to proxy the request
        if (chrome && chrome.runtime) {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({
                    type: 'fetch',
                    url: `${this.baseUrl}${url}`,
                    options
                }, (response) => {
                    if (!response) return reject(new Error('No response'));
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                });
            })

            if (response.error) throw new Error(response.error);

            return response.response;
        } else {
            const response = await fetch(`${this.baseUrl}${url}`, options);
            if (response.status === 204) return;
            const json = await response.json();
            if (response.status >= 400) throw new Error(json.error_description);
            return json;
        }
    }

    #get = async (url) => {
        await this.#checkConfig();
        return await this.#fetch(url);
    }

    #post = async (url, body) => {
        await this.#checkConfig();
        return await this.#fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
        }, {
            'Content-Type': 'application/json'
        });
    }


    async getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        this.currentUser = await this.#get('/api/users/me?fields=email,fullName,login,name,id,avatarUrl,online,guest');
        return this.currentUser;
    }

    async getOrganizations() {
        return await this.#get('/api/admin/organizations?fields=id,name,description,iconUrl,projects(id,name),projectsCount,total');
    }

    async getProjects() {
        return await this.#get('/api/admin/projects?fields=id,name,shortName,iconUrl,description,shortName');
    }

    async getProject(id) {
        return await this.#get(`/api/admin/projects/${id}?fields=id,name,shortName`);
    }

    async getIssuesForProject(id, openOnly = true) {
        return await this.#get(`/api/issues?query=project:{${id}} order by: {created} desc ${openOnly ? 'State: -Resolved' : ''}&fields=id,idReadable,summary,resolved,updated,isDraft`);
    }


    async createIssue(projectId, summary, description = "") {
        return await this.#post('/api/issues?fields=idReadable', {
            project: {
                id: projectId
            },
            summary,
            description
        });
    }

    async createTimer(issueId, YTT, summary) {
        return await this.#post(`/api/issues/${issueId}/timeTracking/workItems?fields=id`, {
            text: `${YTT} ${summary}`,
            duration: { minutes: 1 }
        });
    }

    async updateTimer(issueId, timerId, minutes, summary = "") {
        return await this.#post(`/api/issues/${issueId}/timeTracking/workItems/${timerId}`, {
            text: summary,
            duration: { minutes: minutes < 1 ? 1 : minutes }
        });
    }

    parseYTT(text) {
        // find all instances of [YTT.*]
        const matches = text.match(/\[YTT.*?\]/g);
        if (!matches) return null;
        const match = matches[0].replace('[', '').replace(']', '');
        let parts = match.split('.');

        const values = {
            header: parts.shift(),
            userId: parts.shift()
        };
        for (const part of parts) {
            if (!part.includes('::')) continue;
            const [type, value] = part.split('::');
            values[type] = value;
        }

        return values;
    }

    constructYTT(userID, values) {
        const items = Object.entries(values).map(([type, value]) => `${type}::${value}`).join('.');
        return `[YTT.${userID}.${items}]`;
    }

    async getWorkItems(query = '', limit = 0) {
        const fields = [
            'id',
            'created',
            'updated',
            'text',
            'duration(presentation, minutes)',
            'date',
            'workType(id,name)',
            'issue(id,idReadable,summary,project(id,name,shortName))',
            'type(color(background),name)'
        ].join(',');
        const items = await this.#get(`/api/workItems?author=me&fields=${fields}${query ? `&query=${query}` : ''}${limit ? `&$top=${limit}` : ''}`);

        // filter the results down to only those where the text contains query -- the youtrack API returns old work items that don't match the query due to a bug or something
        return items.map(item => {
            if (item?.text) {
                item.yttData = this.parseYTT(item.text);
            }
            return item;
        })
    }

}

export default YouTrackAPI;