// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	interface Uint8Array {
		toBase64(): string;
		toHex(): string;
	}

	interface Uint8ArrayConstructor {
		fromBase64(base64: string): Uint8Array;
		fromHex(hex: string): Uint8Array;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
