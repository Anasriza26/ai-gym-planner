import React from 'react'

type PageHeadingProps = {
  title: string
  description: string
}

export const PageHeading = ({title,description}: PageHeadingProps) => {
  return (
    <>
    <div className='justify-center items-center text-center space-y-2 mb-2'>
        <h1 className='text-2xl font-bold'> {title}</h1>

        <p className='text-muted-foreground'>
          {description}
        </p>
    </div>
    </>
  )
}
