import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import NavBar from './NavBar'
import ErrorBoundary from 'components/ErrorBoundary'

type PageProps = {
  children: ReactNode,
}
const PagePropTypes = {
  children: PropTypes.node,
}
function Page({ children }: PageProps) {
  return (
    <div className="relative">
      <NavBar />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  )
}

Page.propTypes = PagePropTypes

export default Page
