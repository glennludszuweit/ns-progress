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
const UserProfileBilling = ({ user, refetchUser }) => {
  const [updateBillingAddress, {data, loading}] = useMutation(UPDATE_BILLING);
  const formik = useFormik({
    onSubmit: async values => {
      let billingAddress = { ...values };
      delete billingAddress.country.__typename;
      await updateBillingAddress({variables: { values: billingAddress}})
      await refetchUser();
    },
    validate: values => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
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
      <Typography variant="h3">Billing Address</Typography>
      <Typography variant="body2">
        If you'd like to add a postal address to every invoice, enter it here.
      </Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="companyName"
            label="Company Name"
            props={formik}
            fullWidth
            multiline
          />
          <FormikTextField
            name="address"
            label="Address"
            props={formik}
            fullWidth
            multiline
          />
          <FormikTextField
            name="state"
            label="State - Province - Region"
            props={formik}
            fullWidth
            multiline
          />
          <FormikTextField
            name="zip"
            label="ZIP - Postal Code"
            props={formik}
            fullWidth
            multiline
          />

          <FormikPlaceInput formik={formik} name="country" label="City, Country" />

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

export default UserProfileBilling;
