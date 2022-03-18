import type { NextPage } from 'next'
import PageWithStore from 'components/utility/PageWithStore';
import Signin from 'components/views/user/Signin';
import { useGoDashboard } from 'library/navigation';

const LoginPage: NextPage = () => {

    const goDashboard = useGoDashboard();

    return (<Signin onLogin={goDashboard} />);
}

export default PageWithStore(LoginPage)
