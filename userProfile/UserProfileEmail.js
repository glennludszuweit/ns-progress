import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import isEmailValid from '../../../common/isEmailValid';
import Button from '../Button';
import FormikTextField from '../FormikTextField';
import WarningCard from '../WarningCard';

const CHANGE_EMAIL = gql`
  mutation changeEmail($email: Email!) {
    changeEmail(newEmail: $email)
  }
`;

const RESEND_VERIFICATION = gql`
  mutation resendVerificationEmail {
    resendVerificationEmail
  }
`;

function getErrorMessage(e) {
  const error = e.graphQLErrors[0];
  switch (error.message) {
    case 'email unchanged':
      return 'Email is unchanged';
    case 'email already in use':
      return 'Email already in use';
    default:
      return 'Internal error';
  }
}

export default ({ user, refetchUser }) => {
  const [changeEmail, { data, loading }] = useMutation(CHANGE_EMAIL);
  const [resendVerification, resendData] = useMutation(RESEND_VERIFICATION);
  const formik = useFormik({
    onSubmit: async (values, { setFieldError }) => {
      try {
        await changeEmail({
          variables: values,
        });
        refetchUser();
      } catch (e) {
        setFieldError('email', getErrorMessage(e));
      }
    },
    validate: (values) => {
      let errors = {};
      if (!values.email) errors.email = 'Required';
      else if (!isEmailValid(values.email))
        errors.email = 'Invalid email address';
      return errors;
    },
    initialValues: {
      email: user.email.current,
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Change email</Typography>
      <Grid item xs={12} sm={12}>
        <Typography variant="body2">
          Your email stays always private.
        </Typography>
        {!user.email.isVerified && (
          <WarningCard
            desc="Your current email is not verified. Please click on the link
                provided in the verification email."
          >
            <Button
              size="small"
              loading={resendData.loading}
              successful={!resendData.error && !!resendData.data}
              onClick={resendVerification}
            >
              Resend the email
            </Button>
          </WarningCard>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="email"
            label="Email"
            props={formik}
            fullWidth
          />
          <Button
            size="small"
            loading={loading}
            successful={!!data}
            disabled={!(formik.isValid && formik.dirty)}
          >
            Update
          </Button>
        </form>
      </Grid>
    </>
  );
};
