import React from 'react'
import { SendIcon } from 'lucide-react'
export default function MessageInput() {
  return (
    <div className=' flex items-center border-slate-700/40 '>
            <input type="text" className='w-3/4 border-3 border-slate-700/40 outline-none bg-slate-700/30 p-4' 
            placeholder='Type a message'
            />
            <SendIcon className='absolute'/>

    </div>
  )
}
