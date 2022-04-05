import { useGoEdit, useGoEditId, useGoRoute, useIsRoute } from "hooks/use-url";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useLogoutUser } from "store/UserSlice";


export const useGoDashboard = () => {
    return useGoRoute('/');
}

export const useGoNewClientForInvoice = () => useGoRoute('/invoice-client')
export const useGoClients = () => useGoRoute('/clients');
export const useGoClientEdit = () => useGoEdit('/client');
export const useGoClientIdEdit = (id: string | null = null) => useGoEditId('/client')(id)

export const useGoClientIdDashboard = (id: string | null, invoices?: boolean) => {
    const router = useRouter();
    return useCallback(() => {
        const hash = invoices ? '#invoices' : '';
        if (id) router.push('/client-dashboard?' + new URLSearchParams({ id }) + hash);
    }, [router, id, invoices]);
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

export const useGoInvoiceIdView = (id: string | null, print?: boolean) => {
    const router = useRouter();
    return useCallback(() => {
        const params:Record<string, string> = {};
        if (print === true) {
            params.print = "yes";
        }
        if (id) router.push('/view-invoice?' + new URLSearchParams({ id, ...params }));
    }, [router, id, print]);
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

export const useParamClientId = (): string | null => {
    const router = useRouter();
    if (router.query.clientId) {
        return router.query.clientId.toString();
    }
    return null;
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
