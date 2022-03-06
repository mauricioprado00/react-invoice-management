import React from 'react'
import PropTypes from 'prop-types'
import { CompanyDetails, CompanyDetailsFullPropType, CompanyDetailsPropType } from 'models/CompanyDetails'

type CompanyInfoProps = {
  companyDetails: CompanyDetails,
}
const CompanyInfoPropTypes = {
  companyDetails: PropTypes.oneOfType([
    PropTypes.exact(CompanyDetailsPropType),
    PropTypes.exact(CompanyDetailsFullPropType),
  ])
}

function CompanyInfo({ companyDetails }: CompanyInfoProps) {
  return (
    <p className="mt-2 text-gray-600">
      {companyDetails.name} <br />
      {companyDetails.address} <br />
      <b>Reg Number</b>: {companyDetails.regNumber} <br />
      <b>Vat Number</b>: {companyDetails.vatNumber} <br />
      {companyDetails.iban && <>
        <b>IBAN</b>: {companyDetails.iban} <br />
      </>}
      {companyDetails.swift && <>
        <b>Swift Code</b>: {companyDetails.swift} <br />
      </>}
    </p>
  )
}

CompanyInfo.propTypes = CompanyInfoPropTypes

export default CompanyInfo
