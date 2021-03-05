import gql from 'graphql-tag';
import { useFormik } from 'formik';
import { areRequired } from '../../utils/validation';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useMutation } from '@apollo/react-hooks';

const CHANGE_PASSWORD = gql`
  mutation changeEmail($newPassword: Password!, $oldPassword: Password!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`;

export default () => {
  const [changePassword, { data, loading }] = useMutation(CHANGE_PASSWORD);
  const formik = useFormik({
    onSubmit: async (values, { setFieldError, resetForm }) => {
      try {
        await changePassword({
          variables: {
            newPassword: values.newPasswordA,
            oldPassword: values.oldPassword,
          },
        });
        resetForm();
      } catch (e) {
        switch (e.graphQLErrors[0].message) {
          case 'wrong credentials':
            setFieldError('oldPassword', 'Incorrect password');
            break;
          case 'password is too short':
            setFieldError('newPasswordA', 'Too short');
            break;
          case 'password is too long':
            setFieldError('newPasswordA', 'Too long');
            break;
          case 'password should not contain whitespaces':
            setFieldError('newPasswordA', 'Avoid whitespaces');
            break;
          default:
            setFieldError('newPasswordA', 'Internal error');
        }
      }
    },
    validate: (values) => {
      let errors = {};
      areRequired(values, errors, [
        'oldPassword',
        'newPasswordA',
        'newPasswordB',
      ]);
      if (
        values.newPasswordA &&
        values.newPasswordB &&
        values.newPasswordA !== values.newPasswordB
      )
        errors.newPasswordB = 'Password do not match';
      return errors;
    },
    initialValues: {
      oldPassword: '',
      newPasswordA: '',
      newPasswordB: '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Change password</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            type="password"
            name="oldPassword"
            label="Old password"
            props={formik}
            fullWidth
          />
          <FormikTextField
            type="password"
            name="newPasswordA"
            label="New password"
            props={formik}
            fullWidth
          />
          <FormikTextField
            type="password"
            name="newPasswordB"
            label="Confirm new password"
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
