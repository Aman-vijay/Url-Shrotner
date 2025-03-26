import React from 'react'

const ErrorMessage = ({message}) => {
  return (
    <span className='text-red-400 text-sm'>{message}</span>
  )
}

export default ErrorMessage