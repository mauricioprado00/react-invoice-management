import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import moment from "moment";
import { ClientInvoice, ClientInvoicePropTypes, InvoiceDetail } from 'site-specific/models/Invoice'
import { Me, MePropTypes } from 'site-specific/models/User';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { useGoClientIdDashboard, useGoInvoiceIdEdit } from 'site-specific/hooks/use-navigation';
import { useRouter } from 'next/router';
import Avatar from '../profile/Avatar';

/**
 * invoice layout taken from https://tailwindcomponents.com/component/simple-invoice-with-external-links
 * author: mitchellmusarra
 */

type InvoicePrintProps = {
    clientInvoice: ClientInvoice,
    me: Me,
}

const InvoicePrintPropTypes = {
    clientInvoice: PropTypes.exact(ClientInvoicePropTypes).isRequired,
    me: PropTypes.exact(MePropTypes).isRequired,
}

function InvoicePrint({
    clientInvoice,
    me,
}: InvoicePrintProps) {
    const {
        client: {
            id: clientId,
            avatar,
            name: clientName,
            companyDetails: {
                name: companyName,
                address: companyAddress,
            }
        },
        invoice: {
            invoice_number,
            date,
            meta: {
                billTo: {
                    name: billToName,
                    address: billToAddress,
                    vatNumber: billToVatNumber,
                    regNumber: billToRegNumber,
                },
                details,
            } = {
                // default values when there is no meta use assigned client company details
                billTo: clientInvoice.client.companyDetails,
                details: [] as InvoiceDetail[],
            }
        },
    } = clientInvoice;

    const {
        companyDetails: {
            name: myCompany,
            vatNumber: myVat,
            regNumber: myReg,
        } = {
            // defaultl values if the user does not have company details (only for demo data provided with api server)
        },
    } = me;

    const total = details.reduce((carry, detail) => carry + detail.quantity * detail.rate, 0);

    const printHandler = () => window.print();
    const goEdit = useGoInvoiceIdEdit(clientInvoice.invoice.id);
    const goClientDashboard = useGoClientIdDashboard(clientId);
    const router = useRouter();
    const print = router.query.print;
    useEffect(() => {
        if (print === 'yes') {
            printHandler();
        }
    }, [print])

    return (
        <div className="max-w-2xl mx-auto py-0 md:py-16">
            <article className="shadow-none md:shadow-md md:rounded-md overflow-hidden">
                <div className="md:rounded-b-md  bg-white">
                    <div className="p-9 border-b border-gray-200">
                        <div className="space-y-6">
                            <div className="flex justify-between items-top">
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-bold text-lg"> Invoice </p>
                                        <p>{myCompany}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-400"> Billed To </p>
                                        <p>{billToName}</p>
                                        <p>{billToAddress}</p>
                                        {billToRegNumber && <p><b>Reg Number</b>: {billToRegNumber}</p>}
                                        {billToVatNumber && <p><b>Vat Number</b>: {billToVatNumber}</p>}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-400"> Client </p>
                                        <p>{clientName} at {companyName}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className="font-medium text-sm text-gray-400"> Invoice Number </p>
                                        <p>{invoice_number}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-400"> Invoice Date </p>
                                        <p>{moment(date).format('YYYY-MM-DD')}</p>
                                    </div>
                                    {myVat && <div>
                                        <p className="font-medium text-sm text-gray-400"> VAT </p>
                                        <p>{myVat}</p>
                                    </div>}
                                    {myReg && <div>
                                        <p className="font-medium text-sm text-gray-400"> REG </p>
                                        <p>{myReg}</p>
                                    </div>}
                                    <div className="print:hidden grid grid-cols-3 gap-2">
                                        <Fab size="small" color="secondary" aria-label="print" title="Print Invoice" onClick={printHandler}>
                                            <PrintIcon />
                                        </Fab>
                                        <Fab size="small" color="secondary" aria-label="edit" title="Edit Invoice" onClick={goEdit}>
                                            <EditIcon />
                                        </Fab>
                                        <Fab size="small" color="secondary" aria-label="client profile" title={"Client Profile - " + clientName} onClick={goClientDashboard}>
                                            <Avatar src={avatar} size="none" />
                                        </Fab>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <table className="w-full divide-y divide-gray-200 text-sm">
                        <thead>
                            <tr>
                                <th scope="col" className="px-9 py-4 text-left font-semibold text-gray-400"> Item </th>
                                <th scope="col" className="py-3 text-left font-semibold text-gray-400"></th>
                                <th scope="col" className="py-3 text-left font-semibold text-gray-400"> Quantity </th>
                                <th scope="col" className="py-3 text-left font-semibold text-gray-400"> Rate </th>
                                <th scope="col" className="py-3 text-left font-semibold text-gray-400"> Amount </th>
                                <th scope="col" className="py-3 text-left font-semibold text-gray-400" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {details.map((detail, idx) =>
                                <tr key={idx}>
                                    <td className="px-9 py-5 whitespace-nowrap space-x-1 flex items-center">
                                        <div>
                                            <p>{detail.detail}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap text-gray-600 truncate" />
                                    <td className="whitespace-nowrap text-gray-600 truncate"> {detail.quantity} </td>
                                    <td className="whitespace-nowrap text-gray-600 truncate"> ${detail.rate.toFixed(2)} </td>
                                    <td className="whitespace-nowrap text-gray-600 truncate"> ${(detail.rate * detail.quantity).toFixed(2)} </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                    <div className="p-9 border-b border-gray-200">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm"> Total </p>
                                </div>
                                <p className="text-gray-500 text-sm"> ${total.toFixed(2)} </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-9 border-b border-gray-200">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-black text-lg"> Amount Due </p>
                                </div>
                                <p className="amount-due font-bold text-black text-lg"> ${total.toFixed(2)} </p>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

InvoicePrint.propTypes = InvoicePrintPropTypes

export default InvoicePrint
