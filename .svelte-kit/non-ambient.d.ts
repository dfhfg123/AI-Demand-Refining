
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/competitive" | "/interview" | "/meeting" | "/prd" | "/summarizer" | "/tech-guide";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/competitive": Record<string, never>;
			"/interview": Record<string, never>;
			"/meeting": Record<string, never>;
			"/prd": Record<string, never>;
			"/summarizer": Record<string, never>;
			"/tech-guide": Record<string, never>
		};
		Pathname(): "/" | "/competitive" | "/competitive/" | "/interview" | "/interview/" | "/meeting" | "/meeting/" | "/prd" | "/prd/" | "/summarizer" | "/summarizer/" | "/tech-guide" | "/tech-guide/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.nojekyll" | "/example.md" | "/logo.png" | string & {};
	}
}