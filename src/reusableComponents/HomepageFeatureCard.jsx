import React from 'react'
import Webassets from '../assets/Assets'
import HomepageFeatureSubCard from './HomepageFeatureSubCard'

const HomepageFeatureCard = ({title,para,icon}) => {
  return (
    <section className='w-full flex px-4 md:px-8 lg:px-30 max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:w-full border-b border-r border-l text-(--text-main) border-(--bg-primary)'>
      <div className='flex flex-col md:flex-row lg:flex-col flex-1/5 py-12 md:py-20 lg:py-30 items-start md:items-center lg:items-start border-r border-(--bg-primary) mr-0 md:mr-10 mb-8 md:mb-0'>
        <img className='scale-50 md:scale-60 lg:scale-75 origin-left md:origin-center lg:origin-left' src={icon} alt="" />
        <div className='ml-2 md:ml-0 lg:ml-2'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>{title}</h1>
          <p className='text-(--text-secondary) text-sm md:text-base mt-2 md:mt-4'>{para}</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 py-8 md:py-10 lg:py-10 max-sm:w-full max-sm:flex-col max-sm:p-0 gap-4 md:gap-6 lg:gap-10 flex-1/2'>
        <HomepageFeatureSubCard title="Quality" text="Over 1,000 articles on emerging tech trends and breakthroughs."/>
        <HomepageFeatureSubCard title="Quality" text="Over 1,000 articles on emerging tech trends and breakthroughs."/>
        <HomepageFeatureSubCard title="Quality" text="Over 1,000 articles on emerging tech trends and breakthroughs."/>
        <HomepageFeatureSubCard title="Quality" text="Over 1,000 articles on emerging tech trends and breakthroughs."/>
      </div>
    </section>
  )
}

export default HomepageFeatureCard
