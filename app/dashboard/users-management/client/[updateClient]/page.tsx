import { Breadcrumb } from '@/components/BreadCrumb'
import React from 'react'
import UpdateClientForm from './Components/UpdateClientForm'

const page = () => {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <UpdateClientForm/>
    </div>
  )
}

export default page