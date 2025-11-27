'use client';

import { useEffect } from 'react';

export default function Error({
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
        <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-yellow-400 mb-4">Something went wrong!</h2>

                <div className="bg-black/40 rounded-lg p-4 mb-6 overflow-auto max-h-60 text-sm font-mono text-yellow-100 border border-yellow-500/20">
                    <p className="font-bold mb-2">{error.name}: {error.message}</p>
                    {error.digest && <p className="text-white/40 text-xs">Digest: {error.digest}</p>}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex-1 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-500/50 rounded-lg transition-colors font-medium"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
}
