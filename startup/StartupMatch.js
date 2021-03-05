import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { maxCharacterLength } from '../../utils/validation';
import { updateStartupQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import FormikSwitch from '../FormikSwitch';
import FormikMultiSelect from '../FormikMultiSelect';
import businessTypes from '../../../common/businessTypes';
import businessCategory from '../../../common/businessCategory';
import industries from '../../../common/industries';
import Select from '../Select';
import productStage from '../../../common/productStage';
import financialStatus from '../../../common/financialStatus';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getYear } from 'date-fns';
import Chip from '@material-ui/core/Chip';
import NeoChip from '../NeoChip';
import fundingStage from '../../../common/fundingStage';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';
import { Collapse, makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import revenueModels from '../../../common/revenueModels';

const useStyles = makeStyles(() => ({
  neoChip: {
    marginTop: '5px',
  },
  typeCategoryModelsList: {
    textAlign: 'left',
  },
  stageGrid: {
    padding: 0,
    margin: 0,
  },
  stageList: {
    padding: 0,
    margin: 0,
  },
}));

const lengthChecks = [
  {
    key: 'shortDesc',
    length: maxCharacterLengthConstants.STARTUP_SHORT_DESC,
  },
  {
    key: 'solvedProblems',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'solutions',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'usp',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'competition',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'targetMarket',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
];

function getBasicItems(startup) {
  const items = [];
  return items;
}
export default props => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ startup }) => {
  const classes = useStyles();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = getBasicItems(startup);

    if (startup && startup.fundingStage)
      items.push(
        <ListItem key={8} disableGutters>
          <ListItemText
            primary="Funding stage"
            secondary={
              fundingStage.find(s => s.value === startup.fundingStage).label
            }
          />
        </ListItem>
      );

    if (startup && startup.financialStatus)
      items.push(
        <ListItem key={8} disableGutters>
          <ListItemText
            primary="Financial stage"
            secondary={
              financialStatus.find(s => s.value === startup.financialStatus)
                .label
            }
          />
        </ListItem>
      );
    if (startup && startup.productStage)
      items.push(
        <ListItem key={9} disableGutters>
          <ListItemText
            primary="Product stage"
            secondary={
              productStage.find(s => s.value === startup.productStage).label
            }
          />
        </ListItem>
      );
    if (startup && startup.businessTypes)
      items.push(
        <ListItem key={5} disableGutters>
          <ListItemText
            primary="Business type"
            secondary={
              <>
                {startup.businessTypes.map((i, index) => (
                  <NeoChip
                    className={classes.neoChip}
                    key={index}
                    label={businessTypes.find(ii => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
      );
    if (startup && startup.businessCategory)
      items.push(
        <ListItem key={6} disableGutters>
          <ListItemText
            primary="Business category"
            secondary={
              <>
                {startup.businessCategory.map((i, index) => (
                  <NeoChip
                    className={classes.neoChip}
                    key={index}
                    label={businessCategory.find(ii => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
      );
    if (startup && startup.revenueModels)
      items.push(
        <ListItem key={1}>
          <ListItemText
            primary="Revenue models"
            secondary={
              <>
                {startup.revenueModels.map((i, index) => (
                  <NeoChip
                    key={index}
                    label={revenueModels.find(ii => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
      );

    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">
        Fundraising Modus {startup.fundraisingModus ? ': Yes' : ': No'}
      </Typography>
      {items.length > 0 && (
        <Grid container>
          {items.map((v, i) => {
            const value = v.props.children.props.primary;
            if (
              value === 'Funding stage' ||
              value === 'Financial stage' ||
              value === 'Product stage'
            ) {
              return (
                <Grid item xs={12} sm={4} key={i} className={classes.stageGrid}>
                  <List className={classes.stageList}>{v}</List>
                  {i === 3 && <Divider />}
                </Grid>
              );
            }

            if (value === 'Business type')
              return (
                <Grid item xs={12} sm={4} key={i}>
                  <List className={classes.typeCategoryModelsList}>{v}</List>
                </Grid>
              );
            if (value === 'Business category')
              return (
                <Grid item xs={12} sm={4} key={i}>
                  <List className={classes.typeCategoryModelsList}>{v}</List>
                </Grid>
              );
            if (value === 'Revenue models')
              return (
                <Grid item xs={12} sm={4} key={i}>
                  <List className={classes.typeCategoryModelsList}>{v}</List>
                </Grid>
              );
          })}
        </Grid>
      )}
      {items.length < 1 && (
        <Typography variant="body1">Currently not raising.</Typography>
      )}
    </>
  );
};

const writeable = ({ startup, refetchStartup }) => {
  const [updateStartup, { data, loading }] = useMutation(updateStartupQuery);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getBasicItems(startup));
  }, [startup]);

  const formik = useFormik({
    onSubmit: async values => {
      // console.log(values)
      const p = { ...values };
      // console.log(p)
      if (!p.productStage || p.productStage === '') p.productStage = null;
      if (!p.financialStatus || p.financialStatus === '')
        p.financialStatus = null;
      await updateStartup({
        variables: {
          _id: startup._id,
          startup: p,
        },
      });
    },
    validate: values => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      businessTypes: startup.businessTypes ? startup.businessTypes : [],
      businessCategory: startup.businessCategory
        ? startup.businessCategory
        : [],
      industries: startup.industries ? startup.industries : [],
      financialStatus: startup.financialStatus ? startup.financialStatus : '',
      productStage: startup.productStage ? startup.productStage : '',
      fundingStage: startup.fundingStage ? startup.fundingStage : '',
      fundraisingModus: startup.fundraisingModus
        ? startup.fundraisingModus
        : false,
      revenueModels: startup.revenueModels ? startup.revenueModels : [],
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Dealflow settings</Typography>

      {items.length > 0 && (
        <Grid item xs={12} sm={12}>
          <List>{items}</List>
        </Grid>
      )}
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container wrap="nowrap" alignItems="center">
            <FormikSwitch
              fullWidth
              name="fundraisingModus"
              label="Fundraising Modus"
              formikProps={formik}
            />
            <Tooltip
              title="If you are raising money then turn the fundrasing modus on. This helps your visitors that you are currently on fundraisng."
              placement="top-end"
            >
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>
          <Collapse in={!!formik.values.fundraisingModus}>
            <div>
              <Select
                props={formik}
                label="Funding stage"
                helperText="Select your current funding stage."
                name="fundingStage"
                id="fundingStage"
                options={fundingStage}
              />

              <FormikMultiSelect
                options={businessTypes}
                label="Business type"
                helperText="What is your company business type? Select one or more."
                name="businessTypes"
                formikProps={formik}
              />

              <FormikMultiSelect
                options={businessCategory}
                label="Business category"
                helperText="How would you describe your business category? Select one or more."
                name="businessCategory"
                formikProps={formik}
              />

              <Select
                props={formik}
                label="Financial stage"
                helperText="Select the current financial stage of your company."
                name="financialStatus"
                id="financialStatus"
                options={financialStatus}
              />

              <Select
                props={formik}
                label="Product stage"
                helperText="Select the current product stage of your company."
                name="productStage"
                id="productStage"
                options={productStage}
              />
              <FormikMultiSelect
                options={revenueModels}
                label="Revenue models"
                helperText="Select the revenue models which fits for your business."
                name="revenueModels"
                formikProps={formik}
              />

              <Button
                size="small"
                loading={loading}
                successful={!!data}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Update
              </Button>
            </div>
          </Collapse>
        </form>
      </Grid>
    </>
  );
};
