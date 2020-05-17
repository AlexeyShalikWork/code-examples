export interface IResponseHeaders {
    etag: string;
    'cache-control': string;
    'last-modified': string;
}

export interface IRequestHeaders {
    'If-Modified-Since': string;
    'If-None-Match': string;
}

export interface IRefresh {
    requestHeaders: IRequestHeaders;
    refreshTime: number;
    timeout: number;
}

// Refresh is the service for subscribe to auto-refresh and control the process
// auto-refresh is the periodic server polling (the server sets the interval)
export class Refresh implements IRefresh {
    requestHeaders = {} as IRequestHeaders; // request headers
    refreshTime: number = 0; // time of the interval
    timeout: number = 0; // the timeout object
    callback: any; // the function of the request to the server
    callbackIsFetching: boolean = false; // variable for the loading state
    freezeUpdating: boolean = false; // the variable for freeze polling

    // subscribe
    async subscribeToAutoRefresh(callback: any, clearFirst: boolean = false) {
        if (clearFirst) {
            this.unsubscribeFromAutoRefresh();
        }

        // wait until last fetch will complete
        await this.waitFetchingComplete();

        this.freezeUpdating = false;
        this.callback = callback;

        const response: any = await new Promise((resolve) => {

            // run request to server through the refresh time
            this.timeout = window.setTimeout(async () => {
                if (!this.freezeUpdating) {
                    this.callbackIsFetching = true;
                    const response = await callback(this.requestHeaders);
                    this.callbackIsFetching = false;
                    resolve(response);
                }
            }, this.refreshTime);
        });

        // check if continue
        if (!this.freezeUpdating) {
            if (response && response.headers) {
                this.handleResponseHeaders(response.headers);
            }
            if (this.refreshTime) {
                this.subscribeToAutoRefresh(callback);
            }
        }

        return Promise.resolve(response);
    }

    // unsubscribe
    unsubscribeFromAutoRefresh(clearHeaders: boolean = true) {
        // clear the all of variables
        if (clearHeaders) {
            this.requestHeaders = {} as IRequestHeaders;
        }
        this.refreshTime = 0;
        clearTimeout(this.timeout);
        this.freezeUpdating = true;
    }

    // wait until last fetch will complete
    async waitFetchingComplete() {
        if (this.callbackIsFetching) {
            await new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (!this.callbackIsFetching) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 500);
            });
        }

        return Promise.resolve();
    }

    // stop the auto refresh and run again
    async handleRefreshManually() {
        this.unsubscribeFromAutoRefresh();
        await this.waitFetchingComplete();

        if (this.callback) {
            return Promise.resolve(this.subscribeToAutoRefresh(this.callback));
        } else {
            return Promise.resolve();
        }
    }

    // make the request without the auto refresh
    async handleParallelRequest(callback?: any, clearHeaders: boolean = true) {
        // stop the auto refresh
        this.unsubscribeFromAutoRefresh(clearHeaders);
        await this.waitFetchingComplete();

        // make the request to the server
        if (callback) {
            await callback();
        }

        // run again the auto refresh
        if (this.callback) {
            return Promise.resolve(this.subscribeToAutoRefresh(this.callback));
        } else {
            return Promise.resolve();
        }
    }

    // handle headers
    handleResponseHeaders(responseHeaders: IResponseHeaders) {
        const lastModified = responseHeaders['last-modified'];
        const etag = responseHeaders.etag;
        const cacheControl = responseHeaders['cache-control'];

        if (lastModified) {
            this.requestHeaders['If-Modified-Since'] = lastModified;
        }

        if (etag) {
            this.requestHeaders['If-None-Match'] = etag;
        }

        if (cacheControl && cacheControl.indexOf('max-age') !== -1) {
            const maxAge = Number(cacheControl.substr(cacheControl.lastIndexOf('=') + 1)) * 1000;
            // set the refreshTime from the server
            this.refreshTime = (this.refreshTime !== maxAge) ? maxAge : this.refreshTime;
        }
    }
}
