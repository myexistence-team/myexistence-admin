import React from 'react'
import { useParams } from 'react-router-dom'

export default function TeacherDetails() {
  const { teacherId } = useParams();
  return (
    <div>TeacherDetails</div>
  )
}
