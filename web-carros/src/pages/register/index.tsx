import LogoImg from '../../assets/logo.svg'
import { useEffect } from 'react'
import { Container } from '../../components/container'
import { Link,useNavigate } from 'react-router-dom'
import {Input} from '../../components/input'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {auth} from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'

import {useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'

const schema = z.object({
    name: z.string().nonempty("O campo de nome é obrigatório"),
    email: z.string().nonempty('O campo de email é obrigatório').email("Insira um email valido..."),
    password: z.string().nonempty("O campo de senha é obrigatório").min(8, "A senha deve ter no mínimo 8 caracteres")

})

type FormData = z.infer<typeof schema>



export function Register(){

    const {handleInfoUser} = useContext(AuthContext)

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

    async function onSubmit(data: FormData){
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then( async (user)=>{
            await updateProfile(user.user, {
                displayName: data.name
            })

            handleInfoUser({
                name: data.name,
                email: data.email,
                uid: user.user.uid,
            })

            console.log('Cadastro realizado com sucesso')
            navigate('/dashboard', {replace: true})
        })
        .catch((error) => {
            console.log('error ao cadastrar')
            console.log(error) 
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
                        type='name'
                        placeholder='Digite o seu nome completo...'
                        name='name'
                        error={errors.name?.message}
                        register={register}
                        />
                    
                    </div>

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
                        Cadastrar
                    </button>   
                </form>

                <p className='text-zinc-900'>Já possui uma conta? 
                    <Link className='mx-2 text-red-500' to="/login">
                    Faça Login
                    </Link>
                </p>

            </div>
        </Container>
    )
}