import React, { useEffect, useState } from 'react'

function Avatar({userName, online}) {
    const [color, setColor] = useState('');

    const colors = ['bg-red-300', 'bg-blue-300', 'bg-purple-300', 'bg-yellow-300', 'bg-green-300', 'bg-teal-300', 'bg-stone-300', 'bg-indigo-300', 'bg-emerald-300', 'bg-cyan-300', 'bg-lime-300', 'bg-gray-300', 'bg-slate-300', 'bg-amber-300', 'bg-orange-300']

    useEffect(() => {
        const colorIndex = Math.floor(Math.random() * colors.length)
        setColor(colors[colorIndex]);
    }, [])

    return (
        <div className={"w-9 h-9 relative rounded-full flex items-center "+color}>
            {/* <div className='text-center w-full font-bold'>{userName[0]}</div> */}
            <div className='text-center w-full font-bold'>{userName && userName.length > 0 ? userName[0] : ''}</div>
            {online && (
                <div className='w-3 h-3 absolute rounded-full bg-green-500 border bottom-0 right-0 shadow-xl shadow-black'></div>
            )}
            {!online && (
                <div className='w-3 h-3 absolute rounded-full bg-blue-500 border bottom-0 right-0 shadow-xl shadow-black'></div>
            )}
        </div>
    )
}

export default Avatar