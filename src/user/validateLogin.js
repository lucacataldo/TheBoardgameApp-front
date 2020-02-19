export default function validateLogin(values, touched, isSubmitting) {
  let errors = {};

  if (touched.name || isSubmitting) {
    if (!values.name) {
      errors.name = "Name is required.";
    } else if (values.name.length < 2) {
      errors.name = "Name must to be more than 2 characters.";
    } else if (values.name.length > 75) {
      errors.name = "Name must be under 75 characters.";
    } else if (!/^([a-zA-Z ])+$/.test(values.name)) {
      errors.name = "Name can only contain letters";
    }
  }

  if (touched.email || isSubmitting) {
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email address is invalid";
    } else if (values.email.length > 254) {
      errors.email = "Email must be under 254 characters.";
    }
  }

  if (touched.password || isSubmitting) {
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must to be more than 10 characters.";
    } else if (values.password.length > 64) {
      errors.password = "Password must be under 64 characters.";
    } else if (/\W/.test(values.password)) {
      errors.password = "Password can only be alphanumeric";
    } else if (!/(?=.*[A-Z])/.test(values.password)) {
      errors.password = "Password must contain at least 1 uppercase alphabetical character";
    } else if (!/(?=.*[a-z])/.test(values.password)) {
      errors.password = "Password must contain at least 1 lowercase alphabetical character";
    }
  }

  if (touched.matchPassword || isSubmitting) {
    if (!values.matchPassword) {
      errors.matchPassword = "Please retype password";
    } else if (values.password !== values.matchPassword) {
      errors.matchPassword = "Passwords do not match";
    } else if (values.matchPassword.length < 8) {
      errors.matchPassword = "Password must to be more than 10 characters.";
    } else if (values.matchPassword.length > 64) {
      errors.matchPassword = "Password must be under 64 characters.";
    } else if (/\W/.test(values.matchPassword)) {
      errors.matchPassword = "Password can only be alphanumeric";
    } else if (!/(?=.*[A-Z])/.test(values.matchPassword)) {
      errors.matchPassword = "Password must contain at least 1 uppercase alphabetical character";
    } else if (!/(?=.*[a-z])/.test(values.matchPassword)) {
      errors.matchPassword = "Password must contain at least 1 lowercase alphabetical character";
    }
  }

  return errors;
}

// export default function validateLogin(values) {
//   let errors = {};
//   if (!values.name) {
//     errors.name = "Name is required.";
//   } else if (values.name.length < 2){
//     errors.name = "Name must to be more than 2 characters.";
//   } else if (values.name.length > 75){
//     errors.name = "Name must be under 75 characters.";
//   } else if (!/^([a-zA-Z ])+$/.test(values.name)) {
//     errors.name = "Name can only contain letters";
//   }

//   if (!values.email) {
//     errors.email = "Email is required";
//   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
//     errors.email = "Email address is invalid";
//   } else if (values.email.length > 254) {
//     errors.email = "Email must be under 254 characters."
//   }

//   if (!values.password) {
//     errors.password = "Password is required";
//   } else if (values.password.length < 8) {
//     errors.password = "Password must to be more than 10 characters.";
//   } else if (values.password.length > 64) {
//     errors.password = "Password must be under 64 characters.";
//   } else if (/\W/.test(values.password)) {
//     errors.password = "Password can only be alphanumeric";
//   } else if (!/(?=.*[A-Z])/.test(values.password)) {
//     errors.password = "Password must contain at least 1 uppercase alphabetical character";
//   } else if (!/(?=.*[a-z])/.test(values.password)) {
//     errors.password = "Password must contain at least 1 lowercase alphabetical character";
//   }

//   if (!values.matchPassword) {
//     errors.matchPassword = "Please retype password";
//   } else if (values.password !== values.matchPassword) {
//     errors.matchPassword = "Passwords do not match";
//   }
//   return errors;
// }
