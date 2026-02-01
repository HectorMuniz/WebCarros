import {useState, useEffect} from 'react'
import {Container} from '../../components/container'
import {FaWhatsapp} from 'react-icons/fa'
import { useParams } from 'react-router-dom' 

import {db} from '../../services/firebaseConnection'
import {getDoc, doc} from "firebase/firestore"

interface CarProps{
    id: string;
    name: string;
    model: string;
    year: string;
    km: string;
    price: string | number;
    city: string;
    uid: string;
    whatsapp: string;
    description: string;
    owner: string;
    created: string;
    images: ImageProps[];
}

interface ImageProps{
    uid: string;
    name: string;
    url: string;
}

export function CarDetail(){
    const {id} = useParams();
    const [car, setCar] = useState<CarProps>()
    
    useEffect(() => {
        async function loadCar(){
            if(!id){
                return;
            }

            const docRef = doc(db, "cars", id)
            getDoc(docRef)
            .then((snapshot) => {
                setCar({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    price: snapshot.data()?.price,
                    city: snapshot.data()?.city,
                    uid: snapshot.data()?.uid,
                    whatsapp: snapshot.data()?.whatsapp,
                    description: snapshot.data()?.description,
                    owner: snapshot.data()?.owner,
                    created: snapshot.data()?.created,
                    images: snapshot.data()?.images

                })
            })
            .catch((error) => {
                console.log(error)
                console.log("Deu erro ao carregar o carro")
            })
        }

        loadCar();
    },[id])


    return(
        <Container>
            <h1>slider</h1>

            {car && (
                <main className='w-full bg-white rounded-lg p-6 my-4'> 
                    <div className='flex flex-col sm:flex-row mb-4 items-center justify-between'>
                        <h1 className='font-bold text-3xl text-black'>{car?.name}</h1>
                        <h1 className='font-bold text-3xl text-black'>R$ {car?.price}</h1>
                    </div>

                    <p>{car?.model}</p>

                    <div className='flex w-full gap-6 my-4'>
                        <div className='flex flex-col gap-4'>
                            <div>
                            <p>Ano</p>
                            <strong>{car?.year}</strong>
                        </div>
                        <div>
                            <p>Cidade</p>
                            <strong>{car?.city}</strong>
                        </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <div>
                            <p>KM</p>
                            <strong>{car?.km}</strong>
                        </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className='mb-4'>{car?.description}</p>

                    <strong>Telefone / Whatsapp:</strong>
                    <p className='mb-4'>{car?.whatsapp}</p>

                    <a className='bg-green-500 text-white w-full flex items-center justify-center gap-4 my-6 h-10 text-x; font-medium rounded-lg cursor-pointer' href="">
                        Conversar com o vendedor
                        <FaWhatsapp size={26} color='#fff'/>
                    </a>
                </main>
            )}
        </Container>
    )
}