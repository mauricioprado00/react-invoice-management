import React from 'react'
import ErrorBanner from './ErrorBanner';
import LoadingMask from './LoadingMask';

type ConditionalContentProps = {
    error?: Partial<Error> | null,
    errorMessage?: string,
    loading?: Boolean,
    children: React.ReactNode,
}

export const ConditionalContent = ({ error, loading, errorMessage, children }: ConditionalContentProps) => {

    if (error) {
        return <ErrorBanner error={error}>
            {
                errorMessage ?
                    errorMessage :
                    "There are connectivity problems, we could not load the data"
            }
        </ErrorBanner>;
    }

    if (loading) {
        return <LoadingMask />;
    }

    return <>{children}</>;
}
