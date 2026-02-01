import logoImg from '../../assets/logo.svg'
import { Link } from 'react-router-dom'
import {FiUser, FiLogIn} from 'react-icons/fi'
import { useContext } from 'react' 
import { AuthContext } from '../../context/AuthContext'

export function Header(){
    const {signed, loadingAuth} = useContext(AuthContext)
    // const signed = false
    // const loadingAuth = false

    return(
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
            <header className="w-full max-w-7xl flex items-center justify-between px-6 py-3">
                <Link to="/">
                    <img src={logoImg} alt="Logo WebCarros" />
                </Link>

                {!loadingAuth && signed && (
                    <Link to="/dashboard">
                    <div className='border-2 rounded-full p-1'>
                        <FiUser size={24} color='#000'/>
                    </div>
                    </Link>
                )}

                {!loadingAuth && !signed && (
                    <Link to="/login">
                    <FiLogIn size={24} color='#000'/>
                    </Link>
                )}
            </header>
        </div>
    )
}