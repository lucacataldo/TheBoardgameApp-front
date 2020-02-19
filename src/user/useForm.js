import { useState, useEffect } from "react";
const useForm = (callback, initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = event => {
    setIsSubmitting(false);
    const { name, value } = event.target;
    event.target.className = "form-control"
    setValues({
      ...values,
      [name]: value
    });
    setTouched({
      ...touched,
      [name]: true
    });   
  };
 
  const handleBlur = event => {
    const { name, value } = event.target;
    const currentErr = validate(values, touched, isSubmitting);
    setErrors(currentErr);
    if(!value &&  !Object.keys(currentErr).includes(name) ){
      event.target.className = "form-control"
    }else if(!value&& Object.keys(currentErr).includes(name)){
      event.target.className = "form-control is-invalid";
    }else if(value && Object.keys(currentErr).includes(name)){
      event.target.className = "form-control is-invalid";
    }else if(value && !Object.keys(currentErr).includes(name)){
      event.target.className = "form-control is-valid";
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setErrors(validate(values, touched, true));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (
      Object.keys(errors).length === 0 &&
      isSubmitting &&
      Object.keys(touched).length === Object.keys(values).length
    ) {
      callback();
    }
  }, [errors]);

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors
  };
};

export default useForm;
