import '@lukso/up-provider';

declare global {
    interface Window {
        upProviderInterop: any;
        lukso: any;
    }
}

window.upProviderInterop = {
    async getUPData(): Promise<{ visitorUP: string | null; ownerUP: string | null }> {
        if (!window.lukso) {
            console.error('LUKSO UP-Provider is not available.');
            return { visitorUP: null, ownerUP: null };
        }

        const accounts: string[] = await window.lukso.request({ method: 'eth_accounts' });
        const contextAccounts: string[] = await window.lukso.request({ method: 'eth_requestContext' });

        return {
            visitorUP: accounts.length > 0 ? accounts[0] : null,
            ownerUP: contextAccounts.length > 0 ? contextAccounts[0] : null
        };
    },

    async signMessage(message: string): Promise<string | null> {
        if (!window.lukso) {
            console.error('LUKSO UP-Provider is not available.');
            return null;
        }

        return await window.lukso.request({
            method: 'personal_sign',
            params: [message, window.lukso.selectedAddress]
        });
    }
};