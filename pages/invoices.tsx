import type { NextPage } from 'next'
import AuthPageWithStore from 'site-specific/components/AuthPageWithStore';
import Invoices from 'site-specific/components/sections/invoice/Invoices';

const InvoicesPage: NextPage = () => {
  return <Invoices />
}

export default AuthPageWithStore(InvoicesPage)
