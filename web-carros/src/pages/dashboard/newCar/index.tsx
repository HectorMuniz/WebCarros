import { type ChangeEvent, useState, useContext } from "react"
import { Container } from "../../../components/container"
import { PainelHeader } from "../../../components/painelHeader"
import {FiUpload, FiTrash} from 'react-icons/fi'
import {useForm} from 'react-hook-form'
import { Input } from "../../../components/input"
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {AuthContext} from '../../../context/AuthContext'
import {v4 as uuidV4} from 'uuid'

import {storage, db} from '../../../services/firebaseConnection'
import {
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject
} from 'firebase/storage'

import {addDoc, collection} from 'firebase/firestore'

import toast from 'react-hot-toast'

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatorio"),
    model: z.string().nonempty("O modelo é obrigatorio"),
    year: z.string().nonempty("O ano do carro é obrigatorio"),
    km: z.string().nonempty("O KM do carro é obrigatorio"),
    price: z.string().nonempty("O preço do carro é obrigatorio"),
    city: z.string().nonempty("A cidade é obrigatoria"),
    whatsapp: z.string().min(1, "O whatsapp é obrigatorio").refine((value)=> /^(\d{10,12})$/.test(value), {
        message: "Número de telefone invalido"
    }),
    description: z.string().nonempty("A descrição é obrigatoria")

})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
    uid: string; 
    name: string;
    previewUrl: string;
    url: string
}

export function NewCar(){

    const {user} = useContext(AuthContext)
    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const [carImage, setCarImage ] = useState<ImageItemProps[]>([])

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]
            
            if(image.type === 'image/jpeg'|| image.type === 'image/png'){
                await handleUpload(image)
            }else{
                alert("Envie uma imagem jpeg ou png")
                return;
            }
        }
    }

    async function handleUpload(image: File){
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4()

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
        .then((snapshot)=> {
            getDownloadURL(snapshot.ref).then((downloadUrl)=>{
                const imageItem = {
                    uid: currentUid,
                    name: uidImage,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl
                }
                setCarImage((images) => [
                    ...images, imageItem
                ])
                toast.success("Imagem enviada com sucesso!")
            })
        })

    }

    function onSubmit(data: FormData){
        if(carImage.length === 0){
            toast.error("Envie pelo menos uma imagem!")
            return;
        }

        const carListImages = carImage.map(car => {
            return{
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })

        addDoc(collection(db, "cars"), {
            name: data.name.toUpperCase(),
            model: data.model,
            year: data.year,
            km: data.km,
            price: data.price,
            city: data.city,
            whatsapp: data.whatsapp,
            description: data.description,
            images: carListImages,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid
        })
        .then(() => {
            reset();
            setCarImage([]);
            console.log("Cadastrado com sucesso")
            toast.success("Carro cadastrado com sucesso!")

        })
        .catch((error) => {
            console.log("Deu erro ao cadastrar" + error)
            toast.error("Erro ao cadastrar o carro, tente novamente...")
        })

        
        console.log(data)

    }

    async function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`

        const imageRef = ref(storage, imagePath)

        try{
            await deleteObject(imageRef)
            setCarImage(carImage.filter((car)=> car.url !== item.url))
        }catch(error){
            console.log("Error ao deletar")
        }
    }


    return(
        <Container>
            <PainelHeader/>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000"/>
                    </div>

                    <div className="cursor-pointer ">
                        <input className="opacity-0 cursor-pointer" type="file" accept="image/*" onChange={handleFile}/>
                    </div>
                </button>


                {carImage.map(item => (
                    <div className="w-full h-32 flex items-center justify-center relative" key={item.name}>
                        <button onClick={() => handleDeleteImage(item)} className="absolute">
                            <FiTrash size={28} color="#fff"/>
                        </button>
                        <img className="rounded-lg w-full h-32 object-cover" src={item.previewUrl} alt="previewUrl" />

                    </div>
                ))}

            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col mb:flex-row items-center gap-2 mt-2">
                <form 
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Marca Do Carro</p>
                        <Input
                        type="text"
                        register={register}
                        name="name"
                        error={errors.name?.message}
                        placeholder="Ex: Chevrolet..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo Do Carro</p>
                        <Input
                        type="text"
                        register={register}
                        name="model"
                        error={errors.model?.message}
                        placeholder="Ex: Onix 1.0 Flex Plux Manual..."
                        />
                    </div>

                    <div className='w-full mb-3 flex-row flex  items-center gap-4'>

                    <div className="w-full">
                        <p className="mb-2 font-medium">Ano</p>
                        <Input
                        type="text"
                        register={register}
                        name="year"
                        error={errors.year?.message}
                        placeholder="Ex: 2014/2014"
                        />
                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium">KM</p>
                        <Input
                        type="text"
                        register={register}
                        name="km"
                        error={errors.km?.message}
                        placeholder="Ex: 24.000..."
                        />
                    </div>
                
                    </div>

                    <div className='w-full mb-3 flex-row flex  items-center gap-4'>
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / WhatsApp</p>
                            <Input
                            type="text"
                            register={register}
                            name="whatsapp"
                            error={errors.whatsapp?.message}
                            placeholder="Ex: 21999999999..."
                            />
                        </div>
                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                            type="text"
                            register={register}
                            name="city"
                            error={errors.city?.message}
                            placeholder="Ex: Petrópolis/RJ..."
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                        type="text"
                        register={register}
                        name="price"
                        error={errors.price?.message}
                        placeholder="Ex: 49.900..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                        className="border-2 w-full rounded-md h-24 px-2" 
                        {...register("description")}
                        name="description"
                        id="description"
                        placeholder="Ex: Bancos de Couro, Ar Condicionado..."
                        
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>

                    <button type="submit" className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium ">
                        Cadastrar
                    </button>

                </form>
            </div>
        </Container>
    )
}