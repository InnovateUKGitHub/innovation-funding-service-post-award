import fetch from 'isomorphic-fetch';
import { URL } from 'url';

interface ConnectionConfig {
    instanceUrl: string;
    accessToken: string;
    email: string | null;
}

export class Connection {
    private instanceUrl;
    private accessToken;
    public email;

    constructor({ instanceUrl, accessToken, email }: ConnectionConfig) {
        this.instanceUrl = instanceUrl;
        this.accessToken = accessToken;
        this.email = email;
    }

    async fetch<T>(
        endpoint: string,
        options?: {
            searchParams?: Record<string, string>;
        },
    ): Promise<T> {
        const url = new URL(endpoint, this.instanceUrl);

        if (options?.searchParams) {
            for (const [name, value] of Object.entries(options.searchParams)) {
                url.searchParams.set(name, value);
            }
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        });

        const res = await response.json();

        if (response.status !== 200) {
            let message = `Failed to fetch "${url.toString()}" (status code ${response.status})`;
            message += `Body:\n${JSON.stringify(res)}`;

            throw new Error(message);
        }

        return res as T;
    }
}
