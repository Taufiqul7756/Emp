import React from 'react'
import CreateService from '../Components/CreateService'
import { Breadcrumb } from '@/components/BreadCrumb'

function page() {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <CreateService/>
    </div>
  )
}

export default page