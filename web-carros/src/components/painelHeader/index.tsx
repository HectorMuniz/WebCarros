import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"

export function PainelHeader(){

    async function handleLogout(){
        await signOut(auth)
    }
    return(
        <div className="w-full flex items-center  bg-red-500 text-white h-10 rounded-lg font-medium gap-4 px-4 mb-4">
            <Link to="/dashboard">
            Dashboard
            </Link>
            <Link to="/dashboard/newcar">
            Cadastrar Carro
            </Link>

            <button className="ml-auto" onClick={handleLogout}>
                Sair da conta
            </button>
        </div>
    )
}