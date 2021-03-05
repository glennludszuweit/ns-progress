import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { updatePitchQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormikMultiSelect from '../FormikMultiSelect';
import InputAdornment from '@material-ui/core/InputAdornment';
import moneySources from '../../../common/moneySources';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import productStage from '../../../common/productStage';
import Chip from '@material-ui/core/Chip';
import businessTypes from '../../../common/businessTypes';
import NeoChip from '../../components/NeoChip'
export default (props) => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ startup, pitch }) => {
  return (
    <>
      <Divider />
      <Typography variant="h3">Deal</Typography>
      {(pitch.targetFunding) &&
      <ListItem key={2} disableGutters>
        <ListItemText
          primary="Target funding"
          secondary={`${pitch.targetFunding}$`}
        />
      </ListItem>}
      <Grid container>
        <Grid item xs={12} sm={6}>
        {(pitch.moneyRaised) &&
          <ListItem key={3} disableGutters>
            <ListItemText
              primary="Money raised"
              secondary={`${pitch.moneyRaised}$`}
              />
          </ListItem>
         }
      </Grid>
      <Grid item xs={12} sm={6}>
        {(pitch.moneySources) &&
        <ListItem key={4} disableGutters>
          <ListItemText
            primary="From (Investment Source)"
            secondary={
              <>
                {pitch.moneySources.map((i, index) => (
                  <NeoChip
                    key={index}
                    label={moneySources.find((ii) => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
       }
      </Grid>
      </Grid>
       {(pitch.totalEarlyInvestment) &&
        <ListItem key={1} disableGutters>
          <ListItemText
            primary="Total early investment"
            secondary={`${pitch.totalEarlyInvestment}$`}
          />
        </ListItem>}
        <Grid container>
        <Grid item xs={12} sm={6}>
        {
    (pitch.equityOnOffer) &&
      <ListItem key={5} disableGutters>
        <ListItemText
          primary="Equity on offer"
          secondary={`${pitch.equityOnOffer} %`}
        />
      </ListItem>
         }
      </Grid>
      <Grid item xs={12} sm={6}>
        {
          (pitch.preMoneyValuation)&&
            <ListItem key={6} disableGutters>
              <ListItemText
                primary="Pre-Money valuation"
                secondary={`${pitch.preMoneyValuation}$`}
              />
            </ListItem>
          }
      </Grid>
      </Grid>
    </>
  );
};

const writeable = ({ startup, pitch }) => {
  const [updatePitch, { data, loading }] = useMutation(updatePitchQuery);

  const formik = useFormik({
    onSubmit: async (values) => {
      const s = { ...values };
      Object.entries(s).forEach(([key, value]) => {
        if (value === '') s[key] = null;
        if (s[key] !== 'moneySources' || value !== null) s[key] = parseInt(value)
      });
      console.log(s)
      await updatePitch({
        variables: {
          _id: startup._id,
          pitch: s,
        },
      });
    },
    initialValues: {
      totalEarlyInvestment: pitch.totalEarlyInvestment
        ? pitch.totalEarlyInvestment
        : '',
      targetFunding: pitch.targetFunding ? pitch.targetFunding : '',
      moneyRaised: pitch.moneyRaised ? pitch.moneyRaised : '',
      moneySources: pitch.moneySources ? pitch.moneySources : [],
      equityOnOffer: pitch.equityOnOffer ? pitch.equityOnOffer : '',
      preMoneyValuation: pitch.preMoneyValuation ? pitch.preMoneyValuation : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">How much money have you raised?</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="totalEarlyInvestment"
            prefix='$'
            label="Total early investment"
            props={formik}
            fullWidth
            formatNumber
            prefix='$'
          />
          <FormikTextField
            name="targetFunding"
            label="Target funding"
            props={formik}
            fullWidth
            formatNumber
            prefix='$'
          />
          <FormikTextField
            name="moneyRaised"
            label="Money raised"
            props={formik}
            fullWidth
            formatNumber
            prefix='$'
          />
          <FormikMultiSelect
            options={moneySources}
            label="Investment source"
            helperText="Who did you raise from?"
            name="moneySources"
            formikProps={formik}
          />
          <FormikTextField
            name="equityOnOffer"
            label="Equity on offer"
            props={formik}
            fullWidth
            formatNumber
            suffix="%"
          />
          <FormikTextField
            name="preMoneyValuation"
            label="Pre-Money valuation"
            props={formik}
            fullWidth
            formatNumber
            prefix='$'
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
