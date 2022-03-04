import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import NavBar from '../NavBar'

type PageProps = {
    children: ReactNode,
}
const PagePropTypes = {
    children: PropTypes.node,
}
function Page({children}:PageProps) {
  return (
    <div className="relative">
      <NavBar />
      {children}
    </div>
  )
}

Page.propTypes = PagePropTypes

export default Page
