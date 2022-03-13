import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Card from 'components/ui/layout/Card'
import ErrorBanner from 'components/utility/ErrorBanner'
import { ClientInvoice, Invoice } from 'models/Invoice'
import InvoiceForm, { SaveInvoiceEvent } from './InvoiceForm'
import { useClientList, useClientLoading } from 'store/ClientSlice'
import { useInvoiceLoading, useUpsertInvoice, useUpsertInvoiceError, useUpsertInvoiceState } from 'store/InvoiceSlice'
import { isFullfilledThunk } from 'hooks/use-thunk-dispatch'

type InvoiceProps = {
    onCancel?: (clientInvoice:Partial<ClientInvoice>|null) => void,
    onSave?: (clientInvoice:ClientInvoice) => void,
    invoiceId: string | null,
}
const InvoicePropTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    invoiceId: PropTypes.string,
}
function InvoiceEdition({ onCancel, onSave, invoiceId }: InvoiceProps) {
    const invoice = null;
    const clientList = useClientList();
    // const invoice = useInvoiceById(invoiceId);
    const upsertInvoice = useUpsertInvoice();
    const upsertError = useUpsertInvoiceError();
    const upsertState = useUpsertInvoiceState();
    const loading = [useClientLoading(), useInvoiceLoading()].every(Boolean);
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
        if (onCancel) { onCancel({invoice: invoice || undefined}); return true; }
    }, [onCancel, invoice]);

    let content;

    if (loading) {
        content = "loading data";
    } else if (adding || invoice !== null) {
        content = <InvoiceForm onSave={saveHandler} clientList={clientList}
        onCancel={cancelHandler} invoice={invoice} disabled={saving} />;
    } else {
        if (adding && !invoice) {
            content = "sorry we could not find the invoice";
        } else {
            content = "sorry, we could not load the client list";
        }
    }

    return (
        <Card size="big" title={title} fullscreen={true} background={true}>
            {content}
            {upsertError && <ErrorBanner error={upsertError}>Could not save the invoice.</ErrorBanner>}
        </Card>
    )
}

InvoiceEdition.propTypes = InvoicePropTypes;

export default InvoiceEdition
