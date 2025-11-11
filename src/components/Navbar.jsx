import React from 'react'
import { useState } from 'react';

const Navbar = () => {
  const [color, setColor] = useState("dark");
  const changeTheme = () =>{
    localStorage.setItem('color', color == "dark"?"light":"dark");
    setColor(localStorage.getItem('color'));
    console.log(localStorage.getItem('color'))
  }

  return (
    <section className='w-full flex justify-between bg-(--bg-primary) py-6'>
      <div className='flex items-center gap-2 flex-1/4 justify-center'>
        <div className='w-14 h-14 bg-amber-400'>
          
        </div>
        <p>TECHMESTORY</p>
      </div>
      <ul className='flex items-center flex-1/2 justify-center'>
        <li>HOME</li>
        <li>NEWS</li>
        <li>PODCASTS</li>
        <li>RESOURCES</li>
      </ul>
      <div className=' flex items-center flex-1/4 justify-center'>
        <button className='bg-(--text-accent) text-black font-medium px-5 py-3 rounded-lg'>
            Contact Us
        </button>
        <button onClick={() => changeTheme()}>
          toggle
        </button>
      </div>
    </section>
  )
}

export default Navbar
