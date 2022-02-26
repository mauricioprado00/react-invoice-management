import { useRouter } from "next/router";
import { useCallback } from "react";

export const useGoClient = () => {
    const router = useRouter();
    return (id:string|null=null) => {
        if (id) {
            router.push('/client?' + new URLSearchParams({id}));
        } else {
            router.push('/client');
        }
    }
}

export const useGoNewClient = () => {
    const goClient = useGoClient();
    return useCallback(() => {goClient()}, [goClient])
}

export const useGoIndex = () => {
    const router = useRouter();
    return useCallback(() => {
        router.push('/');
    }, [router]);
}

export const useParamClientId = ():string|null => {
    const router = useRouter();
    if (router.query.id) {
        return router.query.id.toString();
    }
    return null;
}