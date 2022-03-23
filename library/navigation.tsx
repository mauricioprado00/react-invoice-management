import { useRouter } from "next/router";
import { useCallback } from "react";
import { useLogoutUser } from "store/UserSlice";

export const useGoBack = () => {
    const router = useRouter();
    return useCallback(() => {
        router.back();
    }, [router]);
}

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

const useGoEdit = (url: string, params?:Record<string, string>) => {
    const router = useRouter();
    const cb = useCallback((id: string | null = null) => {
        if (id) {
            router.push(url + '?' + new URLSearchParams(Object.assign({ id }, params)));
        } else {
            router.push(url+ (params ? '?' + new URLSearchParams(params) : ''));
        }
    }, [router, url, params]);

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

export const useGoClients = () => useGoRoute('/clients');
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

type GoInvoiceEditParams = {
    clientId?: string;
}

export const useGoInvoices = () => useGoRoute('/invoices');
export const useGoInvoiceEdit = (params?:GoInvoiceEditParams) => useGoEdit('/invoice', params);
export const useGoInvoiceIdEdit = (id: string | null = null) => useGoEditId('/invoice')(id)

export const useGoInvoiceIdView = (id: string | null) => {
    const router = useRouter();
    return useCallback(() => {
        if (id) router.push('/view-invoice?' + new URLSearchParams({ id }));
    }, [router, id]);
}

export const useGoInvoiceView = () => {
    const router = useRouter();
    return useCallback((id: string) => {
        router.push('/view-invoice?' + new URLSearchParams({ id }));
    }, [router]);
}


export const useGoNewClient = () => {
    const goClient = useGoClientEdit();
    return useCallback(() => { goClient() }, [goClient])
}

export const useGoNewInvoice = (params?:GoInvoiceEditParams) => {
    const goInvoice = useGoInvoiceEdit(params);
    return useCallback(() => { goInvoice() }, [goInvoice])
}

export const useGoIndex = () => {
    return useGoRoute('/');
}

export const useGoLogin = () => {
    return useGoRoute('/login');
}

export const useParamId = (): string | null => {
    const router = useRouter();
    if (router.query.id) {
        return router.query.id.toString();
    }
    return null;
}

export const useParamClientId = (): string | null => {
    const router = useRouter();
    if (router.query.clientId) {
        return router.query.clientId.toString();
    }
    return null;
}

export const useRouterParams = () => {
    const router = useRouter();
    return router.query;
}

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

type UrlParam = string | string[] | undefined

export const useUrlParam = <T extends UrlParam,>(name: string, def?: T): [T, (value: T) => void] => {
    const router = useRouter();
    const param = router.query[name] || def;
    const setParam = useCallback((newValue: T) => {
        const query = Object.assign({}, router.query, { [name]: newValue });
        if (newValue === def) {
            delete query[name];
        }
        router.replace({ query });
    }, [def, name, router]);
    return [
        param as T,
        setParam,
    ];
}

export const usePagination = (): [number, (page: number) => void, (event: any, page: number) => void] => {
    const router = useRouter();
    const page = router.query.page ? parseInt(router.query.page.toString()) : 1;
    const setPage = useCallback((page: number) => {
        const query = Object.assign({}, router.query, { page: page.toString() });
        router.replace({ query });
    }, [router]);
    const handlePageChange = useCallback((event: any, page: number) => {
        setPage(page)
    }, [setPage])
    return [
        page,
        setPage,
        handlePageChange,
    ];
}