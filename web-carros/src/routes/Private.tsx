import {type ReactNode, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {Navigate} from 'react-router-dom'

interface PrivateContextProps{
    children: ReactNode;

}


export function PrivateContext({children}: PrivateContextProps): any{

    const {signed, loadingAuth} = useContext(AuthContext);

    if(loadingAuth){
        return <div></div>

    }

    if(!signed){
        return <Navigate to="/login"/>
    }


    return children
}
