import { createClientUPProvider } from '@lukso/up-provider';
import { BrowserProvider } from 'ethers';

// Initialize the LUKSO UP-Provider
const upProvider = createClientUPProvider();

// Create an ethers.js provider using the UP-Provider
const browserProvider = new BrowserProvider(upProvider);

// Store the latest addresses and chain state
let visitorUP: string | null = null;
let ownerUP: string | null = null;
let chainId: number | null = null;
let stateHost: any = null;

// Type for the connection state
type ConnectionState = {
    visitorAddress: string | null;
    ownerAddress: string | null;
    chainId: number | null;
};

// Function to update state when accounts change
async function onAccountsChanged(accounts: string[]) {
    visitorUP = accounts.length > 0 ? accounts[0] : null;
    console.log("✅ Visitor Address Updated:", visitorUP);
    await triggerStateUpdate();
}

// Function to update state when context accounts change
async function onContextAccountsChanged(accounts: string[]) {
    ownerUP = accounts.length > 0 ? accounts[0] : null;
    console.log("✅ Owner Address (Context) Updated:", ownerUP);
    await triggerStateUpdate();
}

// Function to update state when chain changes
async function onChainChanged(newChainId: number) {
    chainId = newChainId;
    console.log("✅ Chain ID Updated:", chainId);
    await triggerStateUpdate();
}

async function updateVisitorUP() {
    const accounts = await browserProvider.listAccounts();
    visitorUP = accounts.length > 0 ? accounts[0].address : null;
}

async function updateChainId() {
    const network = await browserProvider.getNetwork();
    chainId = Number(network?.chainId);
}

async function updateOwnerUP() {
    const contextAccounts = upProvider.contextAccounts;
    ownerUP = contextAccounts.length > 0 ? contextAccounts[0] : null;
}

/**
 * Function to initialize the state variables.
 */
async function initializeState(blazorStateHost: any) {
    stateHost = blazorStateHost; 
    try {
        // Attach event listeners for reactive updates
        upProvider.on('accountsChanged', onAccountsChanged);
        upProvider.on('contextAccountsChanged', onContextAccountsChanged);
        upProvider.on('chainChanged', onChainChanged);
        
        // Initialize visitor accounts
        await updateVisitorUP();

        // Initialize chain ID
        await updateChainId();

        // Initialize owner
        await updateOwnerUP();

        console.log("✅ Initial State Retrieved:");
        console.log("Owner Address (Context):", ownerUP);
        console.log("Visitor Address:", visitorUP);
        console.log("Chain ID:", chainId);

        // Trigger the first state update
        await triggerStateUpdate();
    } catch (error) {
        console.error("❌ Error initializing state:", error);
    }
}

/**
 * Function to return the current connection state.
 */
async function getConnectionState(): Promise<ConnectionState> {
    await updateVisitorUP();
    await updateOwnerUP();
    await updateChainId();

    return {
        visitorAddress: visitorUP,
        ownerAddress: ownerUP,
        chainId: chainId
    };
}

/**
 * Function to sign a message using the visitor's address.
 */
async function signMessage(message: string) {
    try {
        if (!visitorUP) {
            console.error("❌ No Universal Profile connected.");
            return null;
        }

        const signer = await browserProvider.getSigner();
        const signature = await signer.signMessage(message);

        console.log("✅ Signed Message:", signature);
        return signature;
    } catch (error) {
        console.error("❌ Error signing message:", error);
        return null;
    }
}

/**
 * Function to trigger a state update in Blazor.
 */
async function triggerStateUpdate() {
    await stateHost.invokeMethodAsync('StateUpdated');
}

// Expose functions for Blazor Interop
// noinspection JSUnusedGlobalSymbols
(window as any).upProviderInterop = {
    initializeState,
    getConnectionState,
    signMessage
};