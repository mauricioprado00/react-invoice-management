import type { NextPage } from 'next'
import PageWithStore from 'components/utility/PageWithStore';
import Signin from 'components/views/user/Signin';

const Login: NextPage = () => {

    return (<Signin />);
}

export default PageWithStore(Login)
