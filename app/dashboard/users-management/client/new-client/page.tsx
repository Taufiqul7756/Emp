import React from 'react'
import CreateClient from '../Components/CreateClient'
import { Breadcrumb } from '@/components/BreadCrumb'

function page() {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <CreateClient/>
    </div>
  )
}

export default page