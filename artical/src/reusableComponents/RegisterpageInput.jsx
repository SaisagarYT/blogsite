import React from 'react'

const RegisterpageInput = ({title,placeholder,value, type, onChange, name}) => {
  return (
    <div className='w-full flex flex-col gap-1'>
        <h1>{title}</h1>
        <input 
            name={name}
            type={type} 
            value={value} 
            onChange={onChange}
            className='border w-full h-12 rounded-lg duration-200 border-gray-500 indent-2 outline-gray-300 focus:outline-4 transition-all'
            placeholder={placeholder}
        />
    </div>
  )
}

export default RegisterpageInput
