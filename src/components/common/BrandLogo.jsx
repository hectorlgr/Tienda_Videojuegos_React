import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'
import { publicAsset } from '../../utils/assets'

export default function BrandLogo() {
  return (
    <div className="header-logo">
      <Link to="/" className="logo" aria-label="CheckPoint Store — Inicio">
        <ImageWithFallback src={publicAsset('img/Logo_Checkpoint.png')} alt="CheckPoint Store" />
      </Link>
    </div>
  )
}
