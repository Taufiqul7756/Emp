import { Breadcrumb } from '@/components/BreadCrumb'
import React from 'react'
import UpdateCallForm from './Components/UpdateCallForm'

const page = () => {


  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <UpdateCallForm/>
    </div>
  )
}

export default page