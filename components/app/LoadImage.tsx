import { ChangeEvent, useCallback, useRef } from 'react'
import { Button } from '~components/input/Button'
import { useStore } from '~lib/hooks/useStore'
import type { FC } from 'react'

export const LoadImage: FC<{ children?: never }> = () => {
  const { dispatch } = useStore()
  const ref = useRef<HTMLInputElement>(null)

  const onLoadClicked = useCallback(() => {
    ref.current?.click()
  }, [])

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const file = ev.target.files?.[0]
      if (file === undefined) return

      dispatch({ type: 'setImage', value: URL.createObjectURL(file) })
    },
    [dispatch]
  )

  return (
    <>
      <Button onClick={onLoadClicked}>📸 Load Avatar</Button>

      <input
        ref={ref}
        type='file'
        name='avatar'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
    </>
  )
}
