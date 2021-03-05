import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import React, { useEffect, useState } from 'react';
import { updateUserQuery } from '../../apollo/utils/generalQueries';
import { areRequired, maxCharacterLength } from '../../utils/validation';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import FormikPlaceInput from '../FormikPlaceInput';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import userTypes from '../../../common/userTypes';
import Box from '@material-ui/core/Box';
import NeoChip from '../../components/NeoChip';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '../../components/Link';
import Follow from '../Follow';
import { closestIndexTo } from 'date-fns';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  userDetailsContainer: {
    paddingBottom: 0,
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfileName: {
    marginBottom: 0,
  },
  userProfileRole: {
    marginLeft: '5px',
    width: '25px',
    height: '25px',
  },
  userProfileType: {
    paddingBottom: 0,
    padding: 0,
    marginBottom: 0,
  },
  userProfileListItem: {
    paddingTop: 0,
    marginTop: 0,
  },
}));

export default ({ user, refetchUser, readonly, investorOnStealthMode }) =>
  readonly
    ? readable({ user, investorOnStealthMode })
    : writeable({ user, refetchUser, investorOnStealthMode });

const lengthChecks = [
  { key: 'firstName', length: maxCharacterLengthConstants.DEFAULT_SHORT },
  { key: 'lastName', length: maxCharacterLengthConstants.DEFAULT_SHORT },
  {
    key: 'headline',
    length: maxCharacterLengthConstants.USER_HEADLINE,
  },
];
const requiredProps = ['firstName', 'lastName'];

function writeable({ user, refetchUser, investorOnStealthMode }) {
  const [updateUser, { data, loading }] = useMutation(updateUserQuery);

  const formik = useFormik({
    onSubmit: async values => {
      const u = { ...values };
      if (u.location) delete u.location.__typename;
      await updateUser({
        variables: {
          _id: user._id,
          user: u,
        },
      });
      await refetchUser();
    },
    validate: values => {
      let errors = {};
      areRequired(values, errors, requiredProps);
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      headline: user.headline ? user.headline : '',
      location: user.location,
    },
  });

  return (
    <Grid item xs={12} sm={12}>
      <form onSubmit={formik.handleSubmit}>
        <FormikTextField
          name="firstName"
          label="First name"
          props={formik}
          fullWidth
        />
        <FormikTextField
          name="lastName"
          label="Last name"
          props={formik}
          fullWidth
        />
        <FormikTextField
          name="headline"
          label="Headline"
          props={formik}
          fullWidth
          multiline
        />
        <FormikPlaceInput formik={formik} name="location" label="Location" />
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
  );
}

function readable({ user, investorOnStealthMode }) {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const hasSub =
    user &&
    user.stripe &&
    user.stripe.subscription &&
    user.stripe.subscription.active;

  const isFoundingMemberPro =
    user && user.myCollection && user.myCollection.filter(v => v.id == '1');

  useEffect(() => {
    const items = [];
    if (user.firstName || user.lastName)
      items.push(
        <ListItem
          className={classes.userDetailsContainer}
          key={1}
          disableGutters
        >
          <Box display="flex" alignItems="center">
            <Typography
              gutterBottom
              variant="h3"
              className={classes.userProfileName}
            >
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            {hasSub ? (
              <Tooltip title="Member" placement="right-start">
                <Link href="/settings">
                  <Avatar
                    className={classes.userProfileRole}
                    alt="Neo"
                    src="/foundingmember.svg"
                  />
                </Link>
              </Tooltip>
            ) : null}
            {isFoundingMemberPro && (
              <Tooltip title="Founding Member Pro" placement="right-start">
                <Avatar
                  className={classes.userProfileRole}
                  alt="Neo"
                  src="/foundingmemberpro.svg"
                />
              </Tooltip>
            )}
          </Box>
          <Follow userId={user._id} />
        </ListItem>
      );
    if (user.types)
      items.push(
        <ListItem className={classes.userProfileType} key={2} disableGutters>
          <Typography variant="h3" disableGutters gutterBottom>
            {user.types.map((i, index) => {
              if (i !== 4) {
                return (
                  <NeoChip
                    key={index}
                    label={userTypes.find(ii => ii.value === i).label}
                    variant="outlined"
                  />
                );
              }
            })}
            {!investorOnStealthMode && user.types.includes(4) ? (
              <NeoChip
                key={'investors'}
                label={'Investor'}
                variant="outlined"
              />
            ) : null}
          </Typography>
        </ListItem>
      );
    if (user.headline)
      items.push(
        <ListItem
          className={classes.userProfileListItem}
          key={3}
          disableGutters
        >
          <ListItemText primary={user.headline} />
        </ListItem>
      );
    if (user.location)
      items.push(
        <ListItem
          className={classes.userProfileListItem}
          key={4}
          disableGutters
        >
          <ListItemText primary={user.location.formattedAddress} />
        </ListItem>
      );
    setItems(items);
  }, [user]);

  return (
    <>
      {items.length > 0 && <List>{items}</List>}
      {items.length < 1 && (
        <Typography variant="body1">Currently no information.</Typography>
      )}
    </>
  );
}
