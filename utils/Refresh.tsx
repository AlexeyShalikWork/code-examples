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

export class Refresh implements IRefresh {
    requestHeaders = {} as IRequestHeaders;
    refreshTime: number = 0;
    timeout: number = 0;
    callback: any;
    callbackIsFetching: boolean = false;
    freezeUpdating: boolean = false;
    promise: any;

    async subscribeToAutoRefresh(callback: any, clearFirst: boolean = false) {
        if (clearFirst) {
            this.unsubscribeFromAutoRefresh();
        }

        await this.waitFetchingComplete();

        this.freezeUpdating = false;
        this.callback = callback;

        const response: any = await new Promise((resolve) => {
            this.timeout = window.setTimeout(async () => {
                if (!this.freezeUpdating) {
                    this.callbackIsFetching = true;
                    const response = await callback(this.requestHeaders);
                    this.callbackIsFetching = false;
                    resolve(response);
                }
            }, this.refreshTime);
        });

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

    unsubscribeFromAutoRefresh(clearHeaders: boolean = true) {
        if (clearHeaders) {
            this.requestHeaders = {} as IRequestHeaders;
        }
        this.refreshTime = 0;
        clearTimeout(this.timeout);
        this.freezeUpdating = true;
    }

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

    async handleRefreshManually() {
        this.unsubscribeFromAutoRefresh();
        await this.waitFetchingComplete();

        if (this.callback) {
            return Promise.resolve(this.subscribeToAutoRefresh(this.callback));
        } else {
            return Promise.resolve();
        }
    }

    async handleParallelRequest(callback?: any, clearHeaders: boolean = true) {
        this.unsubscribeFromAutoRefresh(clearHeaders);
        await this.waitFetchingComplete();

        if (callback) {
            await callback();
        }

        if (this.callback) {
            return Promise.resolve(this.subscribeToAutoRefresh(this.callback));
        } else {
            return Promise.resolve();
        }
    }

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
            this.refreshTime = (this.refreshTime !== maxAge) ? maxAge : this.refreshTime;
        }
    }
}
