import { useRouter } from "next/router";
import { useCallback } from "react";
import { useLogoutUser } from "store/UserSlice";

export const useGoRoute = (url: string) => {
    const router = useRouter();
    return useCallback(() => {
        router.push(url);
    }, [router, url])
}

export const useIsRoute = (path: string) => {
    const router = useRouter();
    return path === router.pathname;
}

export const useGoDashboard = () => {
    return useGoRoute('/');
}

const useGoEdit = (url: string) => {
    const router = useRouter();
    const cb = useCallback((id: string | null = null) => {
        if (id) {
            router.push(url + '?' + new URLSearchParams({ id }));
        } else {
            router.push(url);
        }
    }, [router, url]);

    return cb;
}

const useGoEditId = (url: string) => {
    const router = useRouter();
    return useCallback((id: string | null = null) => {
        return () => {
            if (id) {
                router.push(url + '?' + new URLSearchParams({ id }));
            } else {
                router.push(url);
            }
        };
    }, [router, url]);
}

export const useGoClientEdit = () => useGoEdit('/client');
export const useGoClientIdEdit = (id: string | null = null) => useGoEditId('/client')(id)

export const useGoClientIdDashboard = (id: string | null) => {
    const router = useRouter();
    return useCallback(() => {
        if (id) router.push('/client-dashboard?' + new URLSearchParams({ id }));
    }, [router, id]);
}

export const useGoClientDashboard = () => {
    const router = useRouter();
    return useCallback((id: string) => {
        router.push('/client-dashboard?' + new URLSearchParams({ id }));
    }, [router]);
}

export const useGoInvoiceEdit = () => useGoEdit('/invoice');
export const useGoInvoiceIdEdit = (id: string | null = null) => useGoEditId('/invoice')(id)

export const useGoInvoiceIdDashboard = (id: string | null) => {
    const router = useRouter();
    return useCallback(() => {
        if (id) router.push('/invoice-dashboard?' + new URLSearchParams({ id }));
    }, [router, id]);
}

export const useGoInvoiceDashboard = () => {
    const router = useRouter();
    return useCallback((id: string) => {
        router.push('/invoice-dashboard?' + new URLSearchParams({ id }));
    }, [router]);
}


export const useGoNewClient = () => {
    const goClient = useGoClientEdit();
    return useCallback(() => { goClient() }, [goClient])
}

export const useGoNewInvoice = () => {
    const goInvoice = useGoInvoiceEdit();
    return useCallback(() => { goInvoice() }, [goInvoice])
}

export const useGoIndex = () => {
    return useGoRoute('/');
}

export const useGoLogin = () => {
    return useGoRoute('/login');
}

const useParamId = (): string | null => {
    const router = useRouter();
    if (router.query.id) {
        return router.query.id.toString();
    }
    return null;
}

export const useParamClientId = useParamId;

export const useParamInvoiceId = useParamId;

export const useLogout = () => {
    const router = useRouter();
    const logoutUser = useLogoutUser();

    return useCallback(() => {
        logoutUser();
        router.push('/login');
    }, [router, logoutUser]);
}

export const useGoMe = () => {
    return useGoRoute('/me');
}

export const useGoEditMe = () => {
    return useGoRoute('/update-profile');
}

export const useIsEditMe = () => {
    return useIsRoute('/update-profile');
}