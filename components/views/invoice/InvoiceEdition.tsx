import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import { ClientInvoice } from 'models/Invoice'
import InvoiceForm, { SaveInvoiceEvent } from './InvoiceForm'
import { useInvoiceById, useInvoiceLoading, useInvoicesLoading, useUpsertInvoice, useUpsertInvoiceError, useUpsertInvoiceState } from 'store/InvoiceSlice'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'
import { usePaymentSelector } from 'store/UserSlice'
import { useAllClients } from 'store/ClientSlice'
import LoadingMask from 'components/ui/LoadingMask'

type InvoiceProps = {
    onCancel?: (clientInvoice:Partial<ClientInvoice>|null) => void,
    onSave?: (clientInvoice:ClientInvoice) => void,
    invoiceId: string | null,
    clientId: string | null,
}
const InvoicePropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    invoiceId: PropTypes.string,
    clientId: PropTypes.string,
}
function InvoiceEdition({ onCancel, onSave, invoiceId, clientId }: InvoiceProps) {
    const invoice = useInvoiceById(invoiceId || '');
    const clientList = useAllClients();
    const clientLoaded = clientList?.loaded === true;
    const paymentTypes = usePaymentSelector();
    // const invoice = useInvoiceById(invoiceId);
    const upsertInvoice = useUpsertInvoice();
    const upsertError = useUpsertInvoiceError();
    const upsertState = useUpsertInvoiceState();
    const loading = [!clientLoaded, useInvoiceLoading()].some(Boolean);
    const saveHandler = async ({ clientInvoice }: SaveInvoiceEvent) => {
        let result = await upsertInvoice(clientInvoice)
        if (isFullfilledThunk(result)) {
            if (onSave) onSave(result.payload.clientInvoice);
        }
    }
    const saving = upsertState === "loading";
    const title = invoiceId ? 'Edit Invoice' : 'Add Invoice';
    const adding = invoiceId === null;

    const cancelHandler = useCallback(() => {
        if (onCancel) { onCancel(invoice || null); return true; }
    }, [onCancel, invoice]);

    let content;

    if (loading) {
        content = <LoadingMask />;
    } else if (adding || invoice !== null) {
        content = <InvoiceForm onSave={saveHandler} clientList={clientList?.list || []} paymentTypes={paymentTypes}
        onCancel={cancelHandler} clientInvoice={invoice} disabled={saving} clientId={clientId} />;
    } else {
        if (adding && !invoice) {
            content = "sorry we could not find the invoice";
        } else {
            content = "sorry, we could not load the client list";
        }
    }

    return (
        <Card size="big" title={title} transparent={false}>
            {content}
            {upsertError && <ErrorBanner error={upsertError}>Could not save the invoice.</ErrorBanner>}
        </Card>
    )
}

InvoiceEdition.propTypes = InvoicePropTypes;

export default InvoiceEdition
