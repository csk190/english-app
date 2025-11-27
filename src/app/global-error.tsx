'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Critical Error</h2>
                    <p className="text-white/80 mb-6">A critical error occurred in the application.</p>

                    <div className="bg-black/40 rounded-lg p-4 mb-6 overflow-auto max-h-60 text-sm font-mono text-red-200 border border-red-500/20">
                        <p className="font-bold mb-2">{error.name}: {error.message}</p>
                        {error.digest && <p className="text-white/40 text-xs">Digest: {error.digest}</p>}
                        {error.stack && <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{error.stack}</pre>}
                    </div>

                    <button
                        onClick={() => reset()}
                        className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/50 rounded-xl transition-colors font-semibold"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
