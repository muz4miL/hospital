import React from 'react';
import {MdShoppingCart,MdAcUnit} from 'react-icons/md';

export default function MedicineItem({ item }) {

  const { status } = item;

  if (status === 'Expired') {
    return null;
  }

  return (
  <div className="border-t-indigo-400 border-gray-700 bg-gray-800 flex flex-col gap-4 w-75% sm:w-[330] rounded-2xl border-2 pl-2 p-14">
    <div className="flex flex-col">
      <div className='pl-2 flex flex-col gap-2 w-full '>
        <hr className='border-gray-700'></hr>
        <MdAcUnit className='h-2 w-2 text-red-400'></MdAcUnit>
        <p className='text-xl font-semibold text-gray-300'>{item.Mname},  <p className=' text-emerald-400'>Units:{item.Mquantity}</p></p>
        <img className='h-300 w-300' src={item.imageUrl} alt = "Image of medicine"/>
        <p className='text-lg text-green-600 truncate'>{item.storageCondition}</p>
        <div className="flex items-center gap-1">
          <MdShoppingCart className='h-4 2-4 text-green-500'></MdShoppingCart>
          <p className='text-sm text-gray-400 truncate'>{item.Msupplier}</p>
          <p className='text-lg text-red-600 truncate'>Rs.{item.Mprice}</p>

        </div>
      </div>
    </div>
  </div>

  );
}

