import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '../Button';
import React, { useEffect, useState } from 'react';
import { updateUserQuery } from '../../apollo/utils/generalQueries';
import userTypes from '../../../common/userTypes';
import FormikMultiSelect from '../FormikMultiSelect';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import industries from '../../../common/industries';
import skills from '../../../common/skills/index';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import NeoChip from '../../components/NeoChip';

export default ({ user, refetchUser, readonly }) =>
  readonly ? readable({ user }) : writeable({ user, refetchUser });

function writeable({ user, refetchUser }) {
  const [updateUser, { data, loading }] = useMutation(updateUserQuery);

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
    initialValues: {
      types: user.types ? user.types : [],
      expertTypes: user.expertTypes ? user.expertTypes : [],
      skills: user.skills ? user.skills : [],
    },
  });

  return (
    <Grid item xs={12} sm={12}>
      <Divider />
      <Typography variant="h3">Role</Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormikMultiSelect
          options={userTypes}
          label="Select role"
          name="types"
          formikProps={formik}
        />

        {formik.values.types.includes(3) && (
          <>
            <FormikMultiSelect
              options={industries}
              label="Expert in"
              helperText="Select the industry sectors you think you are an expert in."
              name="expertTypes"
              formikProps={formik}
            />{' '}
            {formik.values.expertTypes && formik.values.expertTypes.length > 0 && (
              <FormikMultiSelect
                options={skills}
                label="Share your expert skillset and focus area"
                helperText="Select all the skills you think other can testify you for."
                name="skills"
                formikProps={formik}
                selectProps={{
                  groupBy: option => option.group.label,
                  value: formik.values.skills
                    ? formik.values.skills.map(v =>
                        skills.find(o => o.totalValue === v)
                      )
                    : '',
                  onChange: (_, newValue) => {
                    formik.setFieldValue(
                      'skills',
                      newValue.map(v => v.totalValue)
                    );
                  },
                }}
              />
            )}
          </>
        )}

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

function readable({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = [];

    if (user.expertTypes && user.types.includes(3))
      items.push(
        <ListItem key={2} disableGutters>
          <ListItemText>
            <Typography variant="h4" gutterBottom>
              Expert in{console.log(user.expertTypes)}
            </Typography>
            {user.expertTypes.map((i, index) => (
              <NeoChip
                key={index}
                label={industries.find(ii => ii.value === i).label}
                variant="outlined"
              />
            ))}
          </ListItemText>
        </ListItem>
      );
    if (user.skills && user.types.includes(3))
      items.push(
        <ListItem key={3} disableGutters>
          <ListItemText>
            <Typography variant="h4" gutterBottom>
              Skillset and Focus area
            </Typography>
            {user.skills &&
              user.skills.map((i, index) => {
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
      {items.length > 0 && (
        <Grid container>
          {items.map((v, i) => {
            return (
              <Grid item xs={12} sm={12} key={i} key={i + 's'}>
                <List>{v}</List>
              </Grid>
            );
          })}
        </Grid>
      )}
      {items.length < 1 && (
        <Typography variant="body1">Currently no information.</Typography>
      )}
    </>
  );
}
