import { ChangeEventHandler, type FC, useCallback } from 'react'

interface Props {
  id: string
  label: string

  value: boolean
  onChange: (value: boolean) => void
}

export const CheckboxInput: FC<Props> = ({ id, label, value, onChange }) => {
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => {
      if (typeof onChange === 'function') onChange(ev.target.checked)
    },
    [onChange]
  )

  return (
    <>
      <label htmlFor={id}>{label}:</label>
      <input
        type='checkbox'
        className='self-end mb-[1px]'
        name={id}
        id={id}
        checked={value}
        onChange={handleChange}
      />
    </>
  )
}