import React from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import {Outlet} from "react-router-dom"

const AppLayout = () => {
  return (
    <div>
        <main>
            <Header/>
            <Outlet/>

        </main>
        <Footer/>


    </div>
  )
}

export default AppLayout