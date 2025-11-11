import React from 'react'

const HomepageFeatureSubCard = ({title,text}) => {
  return (
    <div className='py-6 text-(--text-main) rounded-2xl px-6 flex flex-col gap-4 bg-(--bg-secondary) border border-(--text-border)'>
        <h1 className='text-2xl text-(--text-main)'>{title}</h1>
        <p className='text-(--text-secondary)'>{text}</p>
    </div>
  )
}

export default HomepageFeatureSubCard
