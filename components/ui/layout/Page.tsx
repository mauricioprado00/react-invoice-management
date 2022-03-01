import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../NavBar'
import { useInitRouter } from 'store/RouteSlice'

type PageProps = {
    children: ReactNode,
}
const PagePropTypes = {
    children: PropTypes.node,
}
function Page({children}:PageProps) {
  useInitRouter();
  return (
    <div className="relative">
      <NavBar />
      {children}
    </div>
  )
}

Page.propTypes = PagePropTypes

export default Page
