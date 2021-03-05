import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '../Button';
import React, { useEffect, useState } from 'react';
import { updateUserQuery } from '../../apollo/utils/generalQueries';
import Typography from '@material-ui/core/Typography';
import FormikTextField from '../FormikTextField';
import { maxCharacterLength } from '../../utils/validation';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import Divider from '@material-ui/core/Divider';
import FormikPlaceInput from '../FormikPlaceInput';
import gql from 'graphql-tag';

const lengthChecks = [
  {
    key: 'desc',
    length: maxCharacterLengthConstants.DEFAULT_LONG,
  },
  {
    key: 'addinfo',
    length: maxCharacterLengthConstants.DEFAULT_LONG,
  },
];
const UPDATE_BILLING = gql`
  mutation updateBillingAddress($values: BillingAddressInput) {
    updateBillingAddress(values: $values)
  }
`;
const UserProfileBillingEmail = ({ user, refetchUser }) => {
  const [updateBillingAddress, {data, loading}] = useMutation(UPDATE_BILLING);
  const formik = useFormik({
    onSubmit: async values => {
      let billingDetails = { ...values };
      delete billingDetails.country.__typename;
      console.log(billingDetails)
      await updateBillingAddress({variables: { values: billingDetails}})
      await refetchUser();
    }, 
    validate: values => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      taxId: user.billingAddress ? user.billingAddress.taxId : '',
      billingEmail: user.billingAddress ? user.billingAddress.billingEmail : '',
      companyName: user.billingAddress ? user.billingAddress.companyName : '',
      address: user.billingAddress ? user.billingAddress.address : '',
      state: user.billingAddress ? user.billingAddress.state : '',
      zip: user.billingAddress ? user.billingAddress.zip : '',
      country: user.billingAddress ? user.billingAddress.country : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Invoice Email Recipient</Typography>
      <Typography variant="body2">
        By default, all your invoices will be sent to your verified email address. If you want to use a custom email address specifically for receiving invoices, enter it here.
      </Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="billingEmail"
            label="Billing email"
            props={formik}
            fullWidth
            multiline
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

export default UserProfileBillingEmail;
