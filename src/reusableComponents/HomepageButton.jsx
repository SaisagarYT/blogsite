import React from 'react'
import Webassets from '../assets/Assets'

const HomepageButton = ({text,icon}) => {
  return (
    <button className='flex py-2 px-3 border items-center border-(--text-secondary) border-dashed rounded-lg'>
        {text}
        <img className='scale-30' src={icon} alt="" />
    </button>
  )
}

export default HomepageButton
