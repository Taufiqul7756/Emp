import React from 'react'
import { Breadcrumb } from './BreadCrumb'

const NotFound = () => {
  return (
     <div className="px-5 grid gap-5">
          <Breadcrumb />
          <div className="flex items-center justify-center p-48">
            <h1 className="text-4xl text-red-500 font-bold ">
              Stay Tuned: Updates in Progress.
            </h1>
          </div>
        </div>
  )
}

export default NotFound