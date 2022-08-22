import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import meConfirm from 'src/components/meConfirm';
import { useGetData } from 'src/hooks/getters';
import { object, string } from 'yup';

export default function StudentForm() {
  const { studentId } = useParams();
  const editMode = Boolean(studentId);
  const dispatch = useDispatch();
  const history = useHistory(); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const student = useGetData("users", studentId);

  const studentSchema = object().shape({
    displayName: string().required().strict(),
    email: string().email().required().strict(),
  })
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(studentSchema)
  })

  function onSubmit(data) {
    meConfirm({
      onConfirm: () => {
        setIsSubmitting(true);
        dispatch(editMode ? )
      }
    })
  }

  return (
    <div>StudentForm</div>
  )
}
