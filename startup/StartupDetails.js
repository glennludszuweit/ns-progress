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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { getCurrentUser } from '../../apollo/utils/userDataUtils';
import WarningCard from '../WarningCard';
import Link from '../Link';


const lengthChecks = [
  { key: 'desc', length: maxCharacterLengthConstants.STARTUP_ABOUT_US },
  { key: 'vision', length: maxCharacterLengthConstants.DEFAULT_LONG },
  { key: 'mission', length: maxCharacterLengthConstants.DEFAULT_LONG },
  { key: 'purpose', length: maxCharacterLengthConstants.DEFAULT_LONG },
];

export default (props) => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ startup }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = [];
    if (startup.desc)
      items.push(
        <ListItem key={1}>
          <ListItemText
            primary={startup.desc}
          />
        </ListItem>
      );
    if (startup.purpose)
      items.push(
        <ListItem key={2}>
          <ListItemText primary="Company purpose" secondary={startup.purpose} />
        </ListItem>
      );
    if (startup.vision)
      items.push(
        <ListItem key={3}>
          <ListItemText primary="Vision statement" secondary={startup.vision} />
        </ListItem>
      );
    if (startup.mission)
      items.push(
        <ListItem key={4}>
          <ListItemText
            primary="Mission statement"
            secondary={startup.mission}
          />
        </ListItem>
      );
    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">About us</Typography>
      <Grid item xs={12} sm={12}>
        {items.length > 0 && <List>{items}</List>}
        {items.length < 1 && (
          <Typography variant="body1">Currently no information.</Typography>
        )}
      </Grid>
    </>
  );
};

const writeable = ({ startup, refetchStartup }) => {
  const [updateStartup, { data, loading }] = useMutation(updateStartupQuery);
  const { user } = getCurrentUser();

  const formik = useFormik({
    onSubmit: async (values) => {
      await updateStartup({
        variables: {
          _id: startup._id,
          startup: values,
        },
      });
      await refetchStartup();
    },
    validate: (values) => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      desc: startup.desc ? startup.desc : '',
      vision: startup.vision ? startup.vision : '',
      mission: startup.mission ? startup.mission : '',
      purpose: startup.purpose ? startup.purpose : '',
    },
  });

  const hasSub =
    user &&
    user.stripe &&
    user.stripe.subscription &&
    user.stripe.subscription.active;

  return (
    <>
      <Divider />
      <Typography variant="h3">About us</Typography>
      <Grid item xs={12} sm={12}>
        {!hasSub && (
          <WarningCard desc="Become a NEOSTARTER member and get full access to a place where magic happens. Your Membership will help us to build a startup ecosystem for all of us and make it easier for the next generation to work on their dreams.">
            <Link href="/settings">
              <Button size="small">Become a member</Button>
            </Link>
          </WarningCard>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="desc"
            label="About us"
            props={formik}
            fullWidth
            multiline
            disabled={!hasSub}
          />
          <FormikTextField
            name="purpose"
            label="Company purpose"
            props={formik}
            fullWidth
            multiline
            disabled={!hasSub}
            placeholder="This is harder than it looks but it will give you and your organization a noth to go and an extra reason to work for."
          />
          <FormikTextField
            name="vision"
            label="Vision statement"
            props={formik}
            fullWidth
            multiline
            disabled={!hasSub}
            placeholder="If all goes well, what will you have built in five years?"
          />
          <FormikTextField
            name="mission"
            label="Mission statement"
            props={formik}
            fullWidth
            multiline
            disabled={!hasSub}
            placeholder="An effective mission statement must be a clear, concise declaration about your business strategy. Don't underestimate the importance of a mission statement. Every entrepreneur should write a mission statement early on because they provide you and your employees with the framework and purpose. If you don't have one, you need to get one. Here are four essential questions your company's mission statement must answer: What do we do? How do we do it? Whom do we do it for? What value are we bringing?"
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
