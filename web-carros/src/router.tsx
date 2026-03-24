import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./components/layout";

import {Home} from './pages/home'
import {Login} from './pages/login'
import {Register} from './pages/register'
import {CarDetail} from './pages/detail'
import {Dashboard} from './pages/dashboard'
import {NewCar} from './pages/dashboard/newCar'

import { PrivateContext } from "./routes/Private";



const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
        {
        path: '/',
        element: <Home/>
        },
        {
        path: `/detail/:id`,
        element: <CarDetail/>
        },
        {
        path: '/dashboard',
        element: <PrivateContext> <Dashboard/> </PrivateContext>
        },
        {
        path: '/dashboard/newcar',
        element:  <PrivateContext> <NewCar/> </PrivateContext>
        }
        ]
    },
    
    {
    path: '/login',
    element: <Login/>
    },
    {
        path: '/register',
        element: <Register/>
    }
])

export {router}