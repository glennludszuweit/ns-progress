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
import FormikMultiSelect from '../FormikMultiSelect';
import skills from '../../../common/skills/index';
import positions from '../../../common/positions/index';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NeoChip from '../NeoChip';
import List from '@material-ui/core/List';

export default ({ user, refetchUser, readonly }) =>
  readonly ? readable({ user }) : writable({ user, refetchUser });

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

function writable({ user, refetchUser }) {
  const [updateUser, { data, loading }] = useMutation(updateUserQuery);
  //const positionsAndSkills = [...skills, ...positions ]
  const formik = useFormik({
    onSubmit: async values => {
      await updateUser({
        variables: {
          _id: user._id,
          user: values,
        },
      });
      await refetchUser();
    },
    validate: values => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      desc: user.desc ? user.desc : '',
      industries: user.industries ? user.industries : [],
      lookingFor: user.lookingFor ? user.lookingFor : [],
      addinfo: user.addinfo ? user.addinfo : '',
    },
  });

  return (
    <>
      <Typography variant="h3">About me</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="desc"
            label="Whats your story?"
            helperText="Tell your visitors something about you let them know who you are. E.g. What makes you unique and special, what is your passion etc."
            props={formik}
            fullWidth
            multiline
          />

          <FormikMultiSelect
            options={skills}
            label="Whats your business and industry interest?"
            name="industries"
            formikProps={formik}
            selectProps={{
              groupBy: option => option.group.label,
              value: formik.values.industries
                ? formik.values.industries.map(v =>
                    skills.find(o => o.totalValue === v)
                  )
                : '',
              onChange: (_, newValue) => {
                formik.setFieldValue(
                  'industries',
                  newValue.map(v => v.totalValue)
                );
              },
            }}
          />
          <FormikTextField
            name="addinfo"
            label="Tell us what you are looking for?"
            helperText="This will help your visitors to see if they or someone in their network can help you out with."
            props={formik}
            fullWidth
            multiline
          />

          <FormikMultiSelect
            options={skills}
            name="lookingFor"
            label="What expertise and skills are you looking for?"
            helperText="This will help to match you with the right experts."
            formikProps={formik}
            selectProps={{
              groupBy: option => option.group.label,
              value: formik.values.lookingFor
                ? formik.values.lookingFor.map(v =>
                    skills.find(o => o.totalValue === v)
                  )
                : '',
              onChange: (_, newValue) => {
                formik.setFieldValue(
                  'lookingFor',
                  newValue.map(v => v.totalValue)
                );
              },
            }}
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
}

function readable({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = [];
    if (user.desc) {
      items.push(
        <ListItem key={1} disableGutters>
          <Typography variant="h3">About me</Typography>
        </ListItem>
      );
      items.push(
        <ListItem key={2} disableGutters>
          <ListItemText primary={user.desc} />
        </ListItem>
      );
    }
    if (user.industries && user.industries.length > 0)
      items.push(
        <ListItem key={3} disableGutters>
          <ListItemText>
            <Typography variant="h4" gutterBottom>
              Business and industry interest
            </Typography>
            {user.industries &&
              user.industries.map((i, index) => {
                const industry = skills.find(ii => ii.totalValue === i);
                if (!industry) return null;
                return (
                  <NeoChip
                    key={index}
                    label={industry.label}
                    variant="outlined"
                  />
                );
              })}
          </ListItemText>
        </ListItem>
      );
    if (user.addinfo) {
      items.push(
        <ListItem key={5} disableGutters>
     
          <ListItemText >
          <Typography variant="h4" gutterBottom>
            Looking for 
          </Typography>
          <Typography >
            {user.addinfo}
          </Typography>
          </ListItemText>
        </ListItem>
      );
    }
    if (user.lookingFor && user.lookingFor.length > 0)
      items.push(
        <ListItem key={4} disableGutters>
          <ListItemText>
            {user.addinfo.length < 1 && 
            <Typography variant="h4" gutterBottom>
              Looking for
            </Typography>}
            {user.lookingFor &&
              user.lookingFor.map((i, index) => {
                const skill = skills.find(ii => ii.totalValue === i);
                if (!skill) return null;
                return (
                  <NeoChip key={index} label={skill.label} variant="outlined" />
                );
              })}
          </ListItemText>
        </ListItem>
      );

    setItems(items);
  }, [user]);

  return (
    <>
      {items.length > 0 && <List>{items}</List>}
      {items.length < 1 && (
        <>
          <Typography variant="h3">About me</Typography>
          <Typography variant="body1">Currently no information.</Typography>
        </>
      )}
    </>
  );
}
