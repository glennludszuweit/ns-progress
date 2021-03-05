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
    key: 'taxId',
    length: maxCharacterLengthConstants.TAX_ID,
  },
];
const UPDATE_BILLING = gql`
  mutation updateBillingAddress($values: BillingAddressInput) {
    updateBillingAddress(values: $values)
  }
`;
const UserProfileTaxId = ({ user, refetchUser }) => {
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
      <Typography variant="h3">Tax ID</Typography>
      <Typography variant="body2">
        If you would like to add a Tax ID to every invoice, enter it here.
      </Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="taxId"
            label="Tax ID"
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

export default UserProfileTaxId;
