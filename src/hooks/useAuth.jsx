// import React, { use } from 'react';
import { use } from 'react';
import { AuthContext } from '../context/authContext';
// import { AuthContext } from '../Context/AuthContext/AuthContext';

const useAuth = () => {

    const authInfo = use(AuthContext)

    return authInfo;
};

export default useAuth;