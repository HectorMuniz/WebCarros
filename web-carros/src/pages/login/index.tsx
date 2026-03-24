import LogoImg from '../../assets/logo.svg'
import { useEffect } from 'react'
import { Container } from '../../components/container'
import { Link, useNavigate } from 'react-router-dom'
import {Input} from '../../components/input'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {auth} from '../../services/firebaseConnection'

import toast from 'react-hot-toast'

const schema = z.object({
    email: z.string().nonempty('O campo de email é obrigatório'). email("Insira um email valido..."),
    password: z.string().nonempty("O campo de senha é obrigatório")

})

type FormData = z.infer<typeof schema>



export function Login(){
    
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    useEffect(()=>{
        async function handleLogout(){
            await signOut(auth)
            
        }

        handleLogout()
    },[])

    function onSubmit(data: FormData){
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
            console.log('Login realizado com sucesso')
            console.log(user)
            toast.success("Logado com sucesso!")
            navigate('/dashboard', {replace: true})
        })
        .catch((error) => {
            console.log('ERRO AO FAZER O LOGIN' + error)
            toast.error("Erro ao fazer login, verifique suas credenciais...")
        })
    }


    return(
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to="/">
                <img className='w-full' src={LogoImg} alt="Logo WebCarros" />
                </Link>

                <form className='bg-white max-w-xl w-full rounded-lg p-4 ' onSubmit={handleSubmit(onSubmit)}>
                    
                    <div className='mb-3'>
                        <Input
                        type='email'
                        placeholder='Digite o seu email...'
                        name='email'
                        error={errors.email?.message}
                        register={register}
                        />
                    
                    </div>

                    <div className='mb-3'>
                        <Input
                        type='password'
                        placeholder='Digite o sua senha...'
                        name='password'
                        error={errors.password?.message}
                        register={register}
                        />
                    
                    </div>

                    <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium '>
                        Acessar
                    </button>   
                </form>

                <p className='text-zinc-900'>Ainda não possui uma conta? 
                    <Link className='mx-2 text-red-500' to="/register">
                    Cadastre-se
                    </Link>
                </p>


            </div>
        </Container>
    )
}