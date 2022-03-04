//import { useRouter } from "next/router";
import { useCallback } from "react";
import { useRouter } from "store/RouteSlice";

export const useGoRoute = (url:string) => {
    const router = useRouter();
    return useCallback(() => {
        router.push(url);
    }, [router, url])
}

export const useGoClientEdit = () => {
    const router = useRouter();
    return useCallback((id:string|null=null) => {
        if (id) {
            router.push('/client?' + new URLSearchParams({id}));
        } else {
            router.push('/client');
        }
    }, [router]);
}

export const useGoClientIdDashboard = (id:string) => {
    const router = useRouter();
    return useCallback(() => {
        router.push('/client-dashboard?' + new URLSearchParams({id}));
    }, [router, id]);
}

export const useGoClientDashboard = () => {
    const router = useRouter();
    return useCallback((id:string) => {
        router.push('/client-dashboard?' + new URLSearchParams({id}));
    }, [router]);
}

export const useGoNewClient = () => {
    const goClient = useGoClientEdit();
    return useCallback(() => {goClient()}, [goClient])
}

export const useGoIndex = () => {
    const router = useRouter();
    return useCallback(() => {
        router.push('/');
    }, [router]);
}

export const useGoLogin = () => {
    const router = useRouter();
    return useCallback(() => {
        router.push('/login');
    }, [router]);
}

export const useParamClientId = ():string|null => {
    const router = useRouter();
    if (router.query.id) {
        return router.query.id.toString();
    }
    return null;
}