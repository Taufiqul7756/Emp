import React from 'react'
import CreateCallOperator from '../Components/CreateCallOperator'
import { Breadcrumb } from '@/components/BreadCrumb'

function page() {
  return (
    <div>
        <div className='ml-4'>
        <Breadcrumb/>
        </div>
        <CreateCallOperator/>
    </div>
  )
}

export default page