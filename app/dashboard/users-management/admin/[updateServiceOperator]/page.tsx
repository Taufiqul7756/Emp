import { Breadcrumb } from '@/components/BreadCrumb'
import React from 'react'
import UpdateAdminForm from './Components/UpdateAdminForm'

const page = () => {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <UpdateAdminForm/>
    </div>
  )
}

export default page