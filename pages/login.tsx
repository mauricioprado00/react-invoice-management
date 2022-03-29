import type { NextPage } from 'next'
import PageWithStore from 'site-specific/components/PageWithStore';
import Signin from 'site-specific/containers/user/Signin';
import { useGoDashboard } from 'library/navigation';

const LoginPage: NextPage = () => {

    const goDashboard = useGoDashboard();

    return (<Signin onLogin={goDashboard} />);
}

export default PageWithStore(LoginPage)
