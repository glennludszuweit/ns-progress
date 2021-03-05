import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { areRequired, maxCharacterLength } from '../../utils/validation';
import FormikDatepicker from '../FormikDatepicker';
import { updateStartupQuery } from '../../apollo/utils/generalQueries';
import Select from '../Select';
import employees from '../../../common/employees';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import FormikSwitch from '../FormikSwitch';
import companyStatus from '../../../common/companyStatus';
import FormikPlaceInput from '../FormikPlaceInput';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import FormikMultiSelect from '../FormikMultiSelect';
import industries from '../../../common/industries';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';
import globalGoals from '../../../common/globalGoals';
import NeoChip from '../NeoChip';
import { getStartupFollowers } from '../../../fe/apollo/utils/userDataUtils';
import { getYear } from 'date-fns';
import Follow from '../Follow';
import StartupVote from './StartupVote';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  startUpDetailsMain: {
    paddingBottom: 0,
    marginBottom: 0,
    marginTop: '30px',
  },
  startUpDetailsContainer: {
    width: '100%',
  },
  startUpDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  startUpName: {
    display: 'flex',
    alignItems: 'center',
  },
  startUpFollowers: {
    fontSize: '10px',
    color: 'grey',
    paddingLeft: '10px',
    fontWeight: 'lighter',
  },
  startUpShortDesc: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
  },
  startUpLocation: {
    paddingTop: 0,
    marginTop: 0,
  },
  startUpMoreInfoGrid: {
    padding: 0,
    margin: 0,
  },
  startUpMoreInfoList: {
    padding: 0,
    margin: 0,
  },
}));

const lengthChecks = [
  { key: 'name', length: maxCharacterLengthConstants.DEFAULT_SHORT },
  {
    key: 'shortDesc',
    length: maxCharacterLengthConstants.STARTUP_SHORT_DESC,
  },
];
const requiredProps = ['name'];

export default props => {
  if (props.startup.hasEditPermissions) return editable(props);
  return readable(props);
};

const readable = ({ startup }) => {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const { startupFollowers, loading } = getStartupFollowers(startup._id);

  useEffect(() => {
    const items = [];
    const totalFollowers =
      startupFollowers && `${startupFollowers.length} follower`;
    console.log(totalFollowers);
    if (startup.name)
      items.push(
        <ListItem key={1} disableGutters className={classes.startUpDetailsMain}>
          <div className={classes.startUpDetailsContainer}>
            <div className={classes.startUpDetails}>
              <Typography
                variant="h3"
                gutterBottom
                className={classes.startUpName}
              >
                {startup.name}
                <span className={classes.startUpFollowers}>
                  {totalFollowers}
                </span>
              </Typography>
              <Box display="flex" alignItems="flex-end">
                <StartupVote
                  startupId={startup._id}
                  startupAdmins={startup.admins}
                />
                <Follow
                  startupId={startup._id}
                  startupAdmins={startup.admins}
                />
              </Box>
            </div>
            <br />
            {startup.globalGoals &&
              startup.globalGoals.map((i, index) => (
                <NeoChip
                  key={index}
                  label={globalGoals.find(ii => ii.value === i).label}
                  variant="outlined"
                />
              ))}
          </div>
        </ListItem>
      );
    if (startup.shortDesc)
      items.push(
        <ListItem className={classes.startUpShortDesc} key={2} disableGutters>
          <ListItemText>{startup.shortDesc}</ListItemText>
        </ListItem>
      );
    if (
      startup.headquaterLocation &&
      startup.headquaterLocation.formattedAddress
    )
      items.push(
        <ListItem className={classes.startUpLocation} key={3} disableGutters>
          <ListItemText
            primary="Headquarter"
            secondary={startup.headquaterLocation.formattedAddress}
          />
        </ListItem>
      );
    if (startup.industries)
      items.push(
        <ListItem key={4} disableGutters>
          <ListItemText
            primary="Business sector"
            secondary={startup.industries.map((i, index) => (
              <NeoChip
                key={index}
                label={industries.find(ii => ii.value === i).label}
                variant="outlined"
              />
            ))}
          />
        </ListItem>
      );

    if (startup.founder)
      items.push(
        <ListItem key={5} disableGutters>
          <ListItemText primary="Founder(s)" secondary={startup.founder} />
        </ListItem>
      );
    if (startup.founded)
      items.push(
        <ListItem key={6} disableGutters>
          <ListItemText
            primary="Founded"
            secondary={getYear(new Date(startup.founded))}
          />
        </ListItem>
      );
    if (startup.employees)
      items.push(
        <ListItem key={7} disableGutters>
          <ListItemText
            primary="Employees"
            secondary={employees.find(e => e.value === startup.employees).label}
          />
        </ListItem>
      );
    if (startup.companyStatus)
      items.push(
        <ListItem key={8} disableGutters>
          <ListItemText
            primary="Company status"
            secondary={
              companyStatus.find(c => c.value === startup.companyStatus).label
            }
          />
        </ListItem>
      );
    if (startup.stockOption)
      items.push(
        <ListItem key={9} disableGutters>
          <ListItemText primary="ESOP Program" secondary="Yes" />
        </ListItem>
      );
    if (startup.incorporated)
      items.push(
        <ListItem key={10} disableGutters>
          <ListItemText
            primary="Incorporated"
            secondary={startup.incorporated ? 'Yes' : 'No'}
          />
        </ListItem>
      );

    setItems(items);
  }, [startup]);

  return (
    <Grid item xs={12} sm={12}>
      {items.length > 0 && (
        <Grid container>
          {items.map((v, i) => {
            const value = v.props.children.props.primary;
            if (
              value === 'Headquarter' ||
              value === undefined ||
              value === 'Global goals' ||
              value === 'Business sector'
            ) {
              return (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  key={i}
                  className={classes.startUpMoreInfoGrid}
                >
                  <List className={classes.startUpMoreInfoList}>{v}</List>
                  {i === 3 && <Divider />}
                </Grid>
              );
            }

            if (
              value === 'Founder(s)' ||
              value === 'Founded' ||
              value === 'Employees' ||
              value === 'Company status' ||
              value === 'ESOP Program' ||
              value === 'Incorporated'
            )
              return (
                <Grid item xs={12} sm={4} key={i}>
                  <List>{v}</List>
                </Grid>
              );
          })}
        </Grid>
      )}
      {items.length < 1 && (
        <Typography variant="body1">Currently no information.</Typography>
      )}
    </Grid>
  );
};

const editable = ({ startup, refetchStartup }) => {
  const [updateStartup, { data, loading }] = useMutation(updateStartupQuery);

  const formik = useFormik({
    onSubmit: async values => {
      const s = { ...values };
      if (!s.employees || s.employees === '') s.employees = null;
      if (!s.companyStatus || s.companyStatus === '') s.companyStatus = null;
      if (s.headquaterLocation) delete s.headquaterLocation.__typename;
      if (!s.globalGoals || s.globalGoals === '') s.globalGoals = [];
      await updateStartup({
        variables: {
          _id: startup._id,
          startup: s,
        },
      });
      await refetchStartup();
    },
    validate: values => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      areRequired(values, errors, requiredProps);
      return errors;
    },
    initialValues: {
      name: startup.name,
      founded: startup.founded ? startup.founded : null,
      founder: startup.founder ? startup.founder : '',
      employees: startup.employees ? startup.employees : '',
      stockOption: startup.stockOption ? startup.stockOption : false,
      shortDesc: startup.shortDesc ? startup.shortDesc : '',
      companyStatus: startup.companyStatus ? startup.companyStatus : '',
      headquaterLocation: startup.headquaterLocation,
      incorporated: startup.incorporated ? startup.incorporated : false,
      industries: startup.industries ? startup.industries : [],
      globalGoals: startup.globalGoals ? startup.globalGoals : [],
    },
  });

  return (
    <>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="name"
            label="Company name"
            props={formik}
            fullWidth
            multiline
          />
          <FormikTextField
            name="shortDesc"
            label="Short description"
            props={formik}
            fullWidth
            multiline
            placeholder="Describe what your company does in no more than two sentence e.g.
            Stripe: Developer-first online payments platform.
            Lyft: Marketplace for mobile ride sharing.
            Intercom: Customer messaging platform."
          />
          <FormikTextField
            name="founder"
            label="Founder(s)"
            props={formik}
            fullWidth
          />
          <FormikDatepicker
            format="YYYY"
            views={['year']}
            id="founded"
            name="founded"
            label="Founding year"
            props={formik}
          />
          <FormikPlaceInput
            formik={formik}
            name="headquaterLocation"
            label="Headquarter"
          />

          <FormikMultiSelect
            options={industries}
            label="Business sectors"
            helperText="Select the business sectors your company fits in. Select one or more."
            name="industries"
            formikProps={formik}
          />
          <Select
            props={formik}
            label="Employees"
            name="employees"
            id="e"
            options={employees}
          />
          <Select
            props={formik}
            label="Company status"
            name="companyStatus"
            id="companyStatus"
            options={companyStatus}
          />
          <Grid container wrap="nowrap" alignItems="center">
            <FormikMultiSelect
              options={globalGoals}
              label="17 Global Goals"
              helperText="Select a SDG that fits for you."
              name="globalGoals"
              formikProps={formik}
            />
            <Tooltip
              title="Are you fitting in one of the 17 SDGs? If yes pls. select one or more. The Sustainable Development Goals are a set of 17 global goals and have been agreed upon by all governments. Read more on NEOIMPACT this is part of our core values."
              placement="top-end"
            >
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap="nowrap" alignItems="center">
            <FormikSwitch
              fullWidth
              name="stockOption"
              label="Employee stock ownership plan?"
              formikProps={formik}
            />
            <Tooltip
              title="Is your company offering ESOP? If yes then turn it on."
              placement="top-end"
            >
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>
          <Grid container wrap="nowrap" alignItems="center">
            <FormikSwitch
              fullWidth
              name="incorporated"
              label="Is your company already incorporated?"
              formikProps={formik}
            />
            <Tooltip
              title="If your company is officially registered then turn it on."
              placement="top-end"
            >
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>
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
