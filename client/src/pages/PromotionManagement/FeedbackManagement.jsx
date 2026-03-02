import React from 'react'
import FeedbackTable from './FeedbackTable';
import SideBar from '../../components/SideBar';

export default function FeedbackManagement() {
  return (
    <div className='flex'>
        <SideBar />
        <div className='flex-1 bg-gray-950 min-h-screen'>
            <div className='bg-gray-900 justify-between flex px-10 py-10'>
            <h1 className='text-4xl font-bold text-emerald-400'>Feedback Management Dashboard</h1>
            <div className='flex gap-6'>
                <div className='flex gap-2 cursor-pointer'>
                <div className='w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xl'>A</div>
                <div className="flex w-full flex-col gap-0.5">
                <div className="flex items-center justify-between font-bold text-white">
                    <h1>Admin</h1>
                </div>
                <p className='text-xs text-gray-400'>Promotion Manager</p>
                </div>
                </div>
            </div>
            </div>
            <FeedbackTable />
        </div>
    </div>
  )
}
