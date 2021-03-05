import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { maxCharacterLength } from '../../utils/validation';
import { updatePitchQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';

const lengthChecks = [
  {
    key: 'moneySource',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'revenueForecast',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'team',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'advisors',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'capitalPurpose',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'timing',
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

    if (pitch.moneySource)
      items.push(
        <ListItem key={2} disableGutters>
          <ListItemText primary="Revenue details" secondary={pitch.moneySource} />
        </ListItem>
      );
    if (pitch.revenueForecast)
      items.push(
        <ListItem key={3} disableGutters>
          <ListItemText
            primary="Revenue forecast"
            secondary={pitch.revenueForecast}
          />
        </ListItem>
      );
    if (pitch.capitalPurpose)
      items.push(
        <ListItem key={4} disableGutters>
          <ListItemText
            primary="Capital purpose"
            secondary={pitch.capitalPurpose}
          />
        </ListItem>
      );
    if (pitch.timing)
      items.push(
        <ListItem key={5} disableGutters>
          <ListItemText primary="Why now" secondary={pitch.timing} />
        </ListItem>
      );
    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">Revenue model</Typography>
      {items.length > 0 && <List>{items}</List>}
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
      const s = { ...values };
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
      moneySource: pitch.moneySource ? pitch.moneySource : '',
      revenueForecast: pitch.revenueForecast ? pitch.revenueForecast : '',
      capitalPurpose: pitch.capitalPurpose ? pitch.capitalPurpose : '',
      timing: pitch.timing ? pitch.timing : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Revenue model?</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>

{/*           <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikMultiSelect
            options={revenueModels}
            label="Revenue models"
            name="revenueModels"
            formikProps={formik}
          />
          <Tooltip title="E.g. (VICE) Advertising,
            (Warby Parker) Commerce and retail, 
            (Uber) Transactional services,
            (Medium) Subscriptions,
            (Etsy) Marketplace,
            (T-Mobile Pre-paid) Usage fee,
            (Development agency) Service fee per unit, 
            (Zipcar) Rental or leasing, 
            (Adobe) Licensing, 
            (eBay) Auctions, 
            (Crunchbase) Data, 
            (Stripe) Transaction processing,
            (Minecraft) App downloads,
            (Clash of Clans) In app purchases." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid> */}

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="moneySource"
            label="Revenue details"
            helperText="How do you make money?"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. We will reach our potential users through in-app referrals, guerilla marketing initiatives, local advertising on social media platforms such as Facebook and Instagram, and promote our app on strategically selected billboards placed near busy bike lanes in NEO City. Our solution is subscription based. Users will pay a monthly subscription fee to get access to our app and service. We will offer student discount to users enrolled in an educational institution."
          />
          <Tooltip title="How do you acquire customers and make money?
What is the pricing model?
Who pays? What are the margins?
What is the long-term value of a customer? (how many months, how many dollars?)
What are the customer acquisition strategy, channels and costs?
How do you intend to thrive?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="revenueForecast"
            label="Revenue forecast"
            helperText="Burn rate, breake even point."
            props={formik}
            fullWidth
            multiline
            placeholder="What is your burn rate, break even point, and how many users you need to make profit?
Show users, revenue and net income."
          />
          <Tooltip title="What is your burn rate, break even point, and how many users you need to make profit? Show users, revenue and net income." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="capitalPurpose"
            label="Capital purpose"
            helperText="What is the planned purpose of the capital requirement?"
            props={formik}
            fullWidth
            multiline
            placeholder="Purpose of capital requirement? E.g. Capital expenses, technology or product development, team, new hires, sales and marketing, founder salaries."
          />
          <Tooltip title="What are you planning to do with the capital? Where and How would you invest it?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="timing"
            label="Why now"
            helperText="Why is now the right timing for your company?"
            props={formik}
            fullWidth
            multiline
            placeholder="What has changed in technology, platforms, customer behavior, laws, etc so that what you are doing is newly possible? The best companies almost always have a clear why now? Nature hates a vacuum, so why hasn't your solution been built before now?"
          />
          <Tooltip title="Why is now the right timing for your company?" placement="top-end">
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
