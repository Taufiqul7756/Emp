import { Breadcrumb } from '@/components/BreadCrumb'
import React from 'react'
import UpdateServiceOperatorForm from './Components/UpdateServiceForm'

const page = () => {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <UpdateServiceOperatorForm/>
    </div>
  )
}

export default page