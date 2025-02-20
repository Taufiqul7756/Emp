import React from 'react'
import CreateAdminForm from '../Components/CreateAdmin'
import { Breadcrumb } from '@/components/BreadCrumb'

function page() {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <CreateAdminForm/>
    </div>
  )
}

export default page