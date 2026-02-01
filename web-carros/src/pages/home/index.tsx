import { Container } from "../../components/container"
import {useState, useEffect} from "react"
import { 
    collection,
    query,
    getDocs,
    orderBy
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";


interface CarProps{
    id: string;
    name: string;
    year: string,
    uid: string,
    price: string | number;
    city: string;
    km: string;
    images: CarImageProps[];
}

interface CarImageProps{
    name: string;
    uid: string;
    url: string;
}

export function Home(){
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])

    useEffect(() => {
        function loadCars(){
            const carsRef = collection(db, "cars")
            const queryRef = query(carsRef, orderBy("created", "desc"))

            getDocs(queryRef)
            .then((snapshot) => {
                let listcars = [] as CarProps[];

                snapshot.forEach( doc => {
                    listcars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid,
                        
                    })
                })

                setCars(listcars)
            })  
        }

        loadCars()

    },[])

    function handleImageLoad(id: string){
        setLoadImages((prevImagesLoaded) => [
            ...prevImagesLoaded,
            id
        ])
    }


    return(
        <Container>
            <section className="bg-white max-w-3xl p-4 rounded-lg w-full flex items-center justify-between px-6 mx-auto gap-2">
                <input 
                className="w-full rounded-lg h-9 px-3 outline-none"
                placeholder="Digite o modelo do carro..." 
                />

                <button className="bg-red-500 h-9 px-8 rounded-lg ">
                    <IoIosSearch size={24} color="#fff"/>
                </button>
            </section>

            <h1 className="font-bold text-center mt-6 text-2xl mb-4">Carros novos e usados em todo Brasil</h1>

            <main className="grid grid-col-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {cars.map( car => (
                    <Link key={car.id} to= {`/detail/${car.id}`}>
                    <section className="w-full bg-white rounded-lg">

                    <div className="w-full h-72 rounded-lg bg-slate-200"
                    style={{display: loadImages.includes(car.id) ? "none" : "block"}}>
                        
                    </div>


                    <img className="w-full rounded-lg mb-2 max-h-72 object-contain hover:scale-105 transition-all duration-400" 
                    style={{display: loadImages.includes(car.id) ? "block" : "none"}}
                    src={car.images[0].url}
                    alt={car.name}
                    onLoad={() => handleImageLoad(car.id)}
                    />

                    <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700 mb-6">Ano: {car.year} | {car.km }km</span>
                        <strong className="text-black font-medium text-xl">
                            R$ {car.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}</strong>
                    </div>

                    <div className="w-full bg-gray-300 h-px my-2"></div>

                    <div className="px-2 pb-2">
                        <span className="text-zinc-700">{car.city}</span>
                    </div>

                </section>
                    </Link>
                ))}
                
                
            </main>
        </Container>

    )
}