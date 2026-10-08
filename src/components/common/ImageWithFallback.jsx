import { useState } from 'react'
import { publicAsset } from '../../utils/assets'

const placeholder = publicAsset('img/image-placeholder.svg')

export default function ImageWithFallback({ src, alt, ...props }) {
  const [failedSource, setFailedSource] = useState(null)
  const imageSource = !src || failedSource === src ? placeholder : src

  return (
    <img
      {...props}
      src={imageSource}
      alt={alt}
      onError={imageSource === placeholder ? undefined : () => setFailedSource(src)}
    />
  )
}
