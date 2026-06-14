import React from 'react'
import { useState } from 'react'

const useFetch = (cb,options={}) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async (...args) => {
        setLoading(true)
        setError(null)
        try {
            const response = await cb(options,...args)
            setData(response)
            setError(null)
            return response
        } catch (err) {
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }
  return { data, loading, error, fetchData }
}

export default useFetch