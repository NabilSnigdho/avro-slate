import { FC } from 'react'
import ReactDOM from 'react-dom'
import { root } from '../../main'

const Portal: FC = ({ children }) =>
  root && ReactDOM.createPortal(children, root)

export default Portal
