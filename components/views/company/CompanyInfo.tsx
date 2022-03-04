import React from 'react'
import PropTypes from 'prop-types'
import { CompanyDetails, CompanyDetailsPropType } from 'models/CompanyDetails'

type CompanyInfoProps = {
  companyDetails: CompanyDetails,
}
const CompanyInfoPropTypes = {
  companyDetails: PropTypes.exact(CompanyDetailsPropType)
}

function CompanyInfo({ companyDetails }: CompanyInfoProps) {
  return (
    <p className="mt-2 text-gray-600">
      {companyDetails.name} <br />
      {companyDetails.address} <br />
      <b>Reg Number</b>: {companyDetails.regNumber} <br />
      <b>Vat Number</b>: {companyDetails.vatNumber} <br />
    </p>
  )
}

CompanyInfo.propTypes = CompanyInfoPropTypes

export default CompanyInfo
