import React, { useEffect } from 'react'

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder
}) => {
  const [value, setValue] = React.useState(initialValue)

  const handleInputChange = (event) =>
    setValue(event.target.value)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      value={value}
      onChange={handleInputChange}
      className={'columnInput'} 
      placeholder={placeholder} 
    />
  )
}

export default DebouncedInput
