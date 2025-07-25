import { useState } from 'react';

// Hook para manejar formularios
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, resetForm, setValues };
};
