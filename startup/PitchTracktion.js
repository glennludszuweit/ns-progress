import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { updatePitchQuery, updateStartupQuery, } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { maxCharacterLength } from '../../utils/validation';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import FormikSwitch from '../FormikSwitch';
import { Collapse } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const lengthChecks = [
  {
    key: 'otherTraction',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
];

export default (props) => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ startup, pitch }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = [];
    if (pitch.activeUsers)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={2} disableGutters>
          <ListItemText primary="Total users" secondary={pitch.totalUsers} />
        </ListItem>
        </Grid>
      );
    if (pitch.totalUsers)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={1} disableGutters>
          <ListItemText
            primary="Active users"
            secondary={`${pitch.activeUsers} per Month`}
            />
        </ListItem>
        </Grid>
      );
    if (pitch.netRevenue)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={3} disableGutters>
          <ListItemText
            primary="Net revenue"
            secondary={`${pitch.netRevenue}$ per Month`}
          />
        </ListItem>
        </Grid>
      );
    if (pitch.otherTraction)
      items.push(
        <Grid item xs={12} sm={12}>
        <ListItem key={4} disableGutters>
          <ListItemText
            primary="Describe Traction / KPIs"
            secondary={pitch.otherTraction}
          />
        </ListItem>
        </Grid>
      );
    if (pitch.recurringRevenue)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={5} disableGutters>
          <ListItemText
            primary="Recurring revenue"
            secondary={`${pitch.recurringRevenue}$ per Month`}
          />
        </ListItem>
        </Grid>
      );
    if (pitch.revenueGrowthRate)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={6} disableGutters>
          <ListItemText
            primary="Revenue growth rate"
            secondary={`${pitch.revenueGrowthRate}% per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.userGrowthRate)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={7} disableGutters>
          <ListItemText
            primary="User growth rate"
            secondary={`${pitch.userGrowthRate}% per Month`}
          />
        </ListItem>
</Grid>
      );

    if (pitch.retentionRate)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={8} disableGutters>
          <ListItemText
            primary="Retention rate"
            secondary={`${pitch.retentionRate}% per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.churnRate)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={9} disableGutters>
          <ListItemText
            primary="Churn rate"
            secondary={`${pitch.churnRate}% per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.gmvGsv)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={10} disableGutters>
          <ListItemText
            primary="GMV/GSV"
            secondary={`${pitch.gmvGsv}$ per Month`}
          />
        </ListItem>
        </Grid>
      );
    if (pitch.averageSalePrice)
      items.push(
        <Grid item xs={12} sm={4}>

        <ListItem key={11} disableGutters>
          <ListItemText
            primary="Average sale price"
            secondary={`${pitch.averageSalePrice} $`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.rakePercentage)
      items.push(
        <Grid item xs={12} sm={4}>

       <ListItem key={12} disableGutters>
          <ListItemText
            primary="Rake percentage"
            secondary={`${pitch.rakePercentage}%`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.cacPayback)
      items.push(
        <Grid item xs={12} sm={4}>

       <ListItem key={13} disableGutters>
          <ListItemText
            primary="CAC Payback"
            secondary={`${pitch.cacPayback} per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.ltvCacRatio)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={14} disableGutters>
          <ListItemText primary="LTV:CAC ratio" secondary={pitch.ltvCacRatio} />
        </ListItem>
</Grid>
      );

    if (pitch.demandFrequency)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={15} disableGutters>
          <ListItemText
            primary="Demand frequency"
            secondary={`${pitch.demandFrequency} per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.supplyFrequency)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={16} disableGutters>
          <ListItemText
            primary="Supply frequency"
            secondary={`${pitch.supplyFrequency} per Month`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.numberOfSignedContracts)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={17} disableGutters>
          <ListItemText
            primary="Number of signed contracts"
            secondary={pitch.numberOfSignedContracts}
          />
        </ListItem>
</Grid>
      );
    if (pitch.annualValueOfSignedContracts)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={18} disableGutters>
          <ListItemText
            primary="Annual value of signed contracts"
            secondary={`${pitch.annualValueOfSignedContracts} $`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.numberOfContractsInPipeline)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={19} disableGutters>
          <ListItemText
            primary="Number of contracts in pipeline"
            secondary={pitch.numberOfContractsInPipeline}
          />
        </ListItem>
</Grid>
      );
    if (pitch.annualValueOfContractsInPipeline)
      items.push(
        <Grid item xs={12} sm={4}>

       <ListItem key={20} disableGutters>
          <ListItemText
            primary="Annual value of contracts in pipeline"
            secondary={`${pitch.annualValueOfContractsInPipeline} $`}
          />
        </ListItem>
</Grid>
      );
    if (pitch.lettersOfIntentSigned)
      items.push(
        <Grid item xs={12} sm={4}>
        <ListItem key={21} disableGutters>
          <ListItemText
            primary="Letters of intent signed"
            secondary={pitch.lettersOfIntentSigned}
          />
        </ListItem>
</Grid>
      );
    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">
        Traction metrics
      </Typography>
      {items.length > 0 && <List>
        <Grid container>

        {items}
        </Grid>
        
        </List>}
      {items.length < 1 && (
        <Typography variant="body1">Currently no information.</Typography>
      )}
    </>
  );
};

const writeable = ({ startup, pitch }) => {
  const [updatePitch, { data, loading }] = useMutation(updatePitchQuery);

  const formik = useFormik({
    onSubmit: async (values) => {
      const s = { ...values }
      Object.entries(s).forEach(([key, value]) => {
        console.log(key,value)
        if(key !== 'otherTraction' && key !== 'advancedTraction') s[key] = parseInt(value)
      });
      console.log(s)
      await updatePitch({
        variables: {
          _id: startup._id,
          pitch: s,
        },
      });
    },
    validate: (values) => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      activeUsers: pitch.activeUsers ? pitch.activeUsers : '',
      totalUsers: pitch.totalUsers ? pitch.totalUsers : '',
      netRevenue: pitch.netRevenue ? pitch.netRevenue : '',
      otherTraction: pitch.otherTraction ? pitch.otherTraction : '',
      advancedTraction: pitch.advancedTraction ? pitch.advancedTraction : false,
      recurringRevenue: pitch.recurringRevenue ? pitch.recurringRevenue : '',
      revenueGrowthRate: pitch.revenueGrowthRate ? pitch.revenueGrowthRate : '',
      userGrowthRate: pitch.userGrowthRate ? pitch.userGrowthRate : '',
      retentionRate: pitch.retentionRate ? pitch.retentionRate : '',
      churnRate: pitch.churnRate ? pitch.churnRate : '',
      gmvGsv: pitch.gmvGsv ? pitch.gmvGsv : '',
      averageSalePrice: pitch.averageSalePrice ? pitch.averageSalePrice : '',
      rakePercentage: pitch.rakePercentage ? pitch.rakePercentage : '',
      cacPayback: pitch.cacPayback ? pitch.cacPayback : '',
      ltvCacRatio: pitch.ltvCacRatio ? pitch.ltvCacRatio : '',
      demandFrequency: pitch.demandFrequency ? pitch.demandFrequency : '',
      supplyFrequency: pitch.supplyFrequency ? pitch.supplyFrequency : '',
      numberOfSignedContracts: pitch.numberOfSignedContracts
        ? pitch.numberOfSignedContracts
        : '',
      annualValueOfSignedContracts: pitch.annualValueOfSignedContracts
        ? pitch.annualValueOfSignedContracts
        : '',
      numberOfContractsInPipeline: pitch.numberOfContractsInPipeline
        ? pitch.numberOfContractsInPipeline
        : '',
      annualValueOfContractsInPipeline: pitch.annualValueOfContractsInPipeline
        ? pitch.annualValueOfContractsInPipeline
        : '',
      lettersOfIntentSigned: pitch.lettersOfIntentSigned
        ? pitch.lettersOfIntentSigned
        : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">
        What are the traction metrics that most excite you about your business?
      </Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="activeUsers"
            label="Active users"
            props={formik}
            formatNumber
            fullWidth
          />
          <FormikTextField
            name="totalUsers"
            label="Total users"
            props={formik}
            fullWidth
            formatNumber
          />
          <FormikTextField
            name="netRevenue"
            label="Net revenue"
            props={formik}
            fullWidth
            formatNumber
            prefix="$"
          />
          <FormikTextField
            name="otherTraction"
            label="Describe Traction / KPIs"
            helperText="Share any kind of traction E.g. sales, success stories etc."
            props={formik}
            fullWidth
            multiline
            placeholder="Show traction you have so far: Sales, growth metrics, milestones to date, press, success stories, testimonials.
            Add any additional company traction metrics here."
          />
          <FormikSwitch
            fullWidth
            name="advancedTraction"
            label="Advanced Traction"
            formikProps={formik}
          />
          <Collapse in={!!formik.values.advancedTraction}>
            <div>
              <FormikTextField
                name="recurringRevenue"
                label="Recurring revenue"
                props={formik}
                fullWidth
                formatNumber
                prefix="$"
                suffix=" per month"
              />
              <FormikTextField
                name="revenueGrowthRate"
                label="Revenue growth rate"
                props={formik}
                fullWidth
                formatNumber
                suffix="% per month"
              />
              <FormikTextField
                name="userGrowthRate"
                label="User growth rate"
                props={formik}
                fullWidth
                formatNumber
                suffix="% per month"
              />
              <FormikTextField
                name="retentionRate"
                label="Retention rate"
                props={formik}
                fullWidth
                formatNumber
                suffix="% per month"
              />
              <FormikTextField
                name="churnRate"
                label="Churn rate"
                props={formik}
                fullWidth
                formatNumber
                suffix="% per month"
              />
              <FormikTextField
                name="gmvGsv"
                label="GMV/GSV"
                props={formik}
                fullWidth
                formatNumber
                prefix="$"
                suffix=" per month"
              />
              <FormikTextField
                name="averageSalePrice"
                label="Average sale price"
                props={formik}
                fullWidth
                formatNumber
                prefix="$"
              />
              <FormikTextField
                name="rakePercentage"
                label="Rake percentage"
                props={formik}
                fullWidth
                formatNumber
                suffix="%"
              />
              <FormikTextField
                name="cacPayback"
                label="CAC Payback"
                props={formik}
                fullWidth
                formatNumber
                suffix=" per month"
              />
              <FormikTextField
                name="ltvCacRatio"
                label="LTV:CAC Ratio"
                props={formik}
                fullWidth
                formatNumber
              />
              <FormikTextField
                name="demandFrequency"
                label="Demand frequency"
                props={formik}
                fullWidth
                formatNumber
                suffix=" per month"
              />
              <FormikTextField
                name="supplyFrequency"
                label="Supply frequency"
                props={formik}
                fullWidth
                formatNumber
                suffix=" per month"
              />
              <FormikTextField
                name="numberOfSignedContracts"
                label="Number of signed contracts"
                props={formik}
                fullWidth
                formatNumber
                     />
              <FormikTextField
                name="annualValueOfSignedContracts"
                label="Annual value of signed contracts"
                props={formik}
                fullWidth
                formatNumber
                prefix="$"
              />
              <FormikTextField
                name="numberOfContractsInPipeline"
                label="Number of contracts in pipeline"
                props={formik}
                fullWidth
                formatNumber
                      />
              <FormikTextField
                name="annualValueOfContractsInPipeline"
                label="Annual value of contracts in pipeline"
                props={formik}
                fullWidth
                formatNumber
                prefix="$"
              />
              <FormikTextField
                name="lettersOfIntentSigned"
                label="Letters of intent signed"
                props={formik}
                fullWidth
                formatNumber
              />
            </div>
          </Collapse>

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
