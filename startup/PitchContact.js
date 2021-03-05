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

const lengthChecks = [
  {
    key: 'contactPerson',
    length: maxCharacterLengthConstants.DEFAULT_SHORT,
  },
  {
    key: 'contactEmail',
    length: maxCharacterLengthConstants.DEFAULT_SHORT,
  },
  {
    key: 'contactPhone',
    length: maxCharacterLengthConstants.DEFAULT_SHORT,
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
    if (pitch.contactPerson)
      items.push(
        <ListItem key={1}>
          <ListItemText
            primary="Person in charge"
            secondary={pitch.contactPerson}
          />
        </ListItem>
      );
    if (pitch.contactEmail)
      items.push(
        <ListItem key={2}>
          <ListItemText
            primary="E-Mail Adress"
            secondary={pitch.contactEmail}
          />
        </ListItem>
      );
    if (pitch.contactPhone)
      items.push(
        <ListItem key={3}>
          <ListItemText primary="Phone number" secondary={pitch.contactPhone} />
        </ListItem>
      );
    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">Contact details</Typography>
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
      contactPhone: pitch.contactPhone ? pitch.contactPhone : '',
      contactEmail: pitch.contactEmail ? pitch.contactEmail : '',
      contactPerson: pitch.contactPerson ? pitch.contactPerson : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">Contact details</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikTextField
            name="contactPerson"
            label="Person in charge"
            props={formik}
            fullWidth
          />
          <FormikTextField
            name="contactEmail"
            label="E-Mail address"
            props={formik}
            fullWidth
          />
          <FormikTextField
            name="contactPhone"
            label="Phone number"
            props={formik}
            fullWidth
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
