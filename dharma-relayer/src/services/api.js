const defaultAPI = process.env.REACT_APP_API_SERVER || "";

class Api {
    constructor(apiUrl) {
        this.apiUrl = apiUrl || defaultAPI;
    }

    /**
     * Makes a GET request to the API server, and returns a promise
     * with the resulting JSON response.
     *
     * @example
     * get("loanRequests");
     * => <Promise>
     *
     * // Specifying only orders with REP as then collateral.
     * get("loanRequests?collateralTokenSymbol=REP");
     * => <Promise>
     *
     * @param resource
     * @returns {Promise<any>}
     */

    /**
     * Makes a GET request to the API server, and returns a promise
     * with the resulting JSON response.
     *
     * @example
     * get("loanRequests");
     * => <Promise>
     *
     * // Specifying only orders with REP as then collateral.
     * get("loanRequests?collateralTokenSymbol=REP");
     * => <Promise>
     *
     * // Similar to the above, using the params object:
     * get("loanRequests", { collateralTokenSymbol: "REP" });
     * => <Promise>
     *
     * @param resource
     * @param params
     * @returns {Promise}
     */
    get(resource, params) {
        const query = params ? `?${this.parseQueryParams(params)}` : '';

        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}/${resource}${query}`)
                .then((response) => resolve(response.json()))
                .catch((reason) => reject(reason));
        });
    }

    /**
     * Allows deleting a record from the database.
     *
     * @param resource
     * @param id
     * @returns {Promise}
     */
    delete(resource, id) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}/${resource}/${id}`, { method: "DELETE" })
                .then((response) => resolve(response.json()))
                .catch((reason) => reject(reason));
        });
    }

    /**
     * Creates a new resource by posting the given data to the API.
     *
     * @param resource
     * @param data
     * @returns {Promise<any>}
     */
    create(resource = "loanRequests", data) {
        return new Promise((resolve, reject) => {
            fetch(`${this.apiUrl}/${resource}`, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then(async (response) => {
                    const loanRequest = await response.json();
                    resolve(loanRequest.id);
                })
                .catch((reason) => reject(reason));
        });
    }

    /**
     *
     * @example
     * parseQueryParams({ a: "a", b: "b" });
     * => "a=a&b=b"
     *
     * @param params
     * @returns {string}
     */
    parseQueryParams(params) {
        return Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
    }
}

export default Api;
