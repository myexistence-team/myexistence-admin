import React from 'react'
import { FaCheckCircle, FaClock, FaHandPaper, FaWindowClose } from 'react-icons/fa'
import { PRESENCE_STATUSES } from 'src/constants'
import meColors from './meColors'

export default function MEPresenceIcon({ status, size = 24, ...rest }) {
  const iconProps = {
    size,
    ...rest
  }
  console.log(iconProps);
  switch (status) {
    case PRESENCE_STATUSES.EXCUSED:
      return <FaHandPaper color={meColors.yellows[3]} { ...iconProps }/>
    case PRESENCE_STATUSES.LATE:
      return <FaClock color={meColors.orange} { ...iconProps }/>
    case PRESENCE_STATUSES.ABSENT:
      return <FaWindowClose color={meColors.danger} { ...iconProps }/>
    default:
      return <FaCheckCircle color={meColors.success.main} { ...iconProps }/>
  }
}
