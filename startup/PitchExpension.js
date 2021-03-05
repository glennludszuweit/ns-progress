import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import { maxCharacterLength } from '../../utils/validation';
import { updatePitchQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import FormikMultiSelect from '../FormikMultiSelect';
import regions from '../../../common/regions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import NeoChip from '../../components/NeoChip'

const lengthChecks = [
  {
    key: 'moneySource',
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
    if (pitch.expansionFocus)
      items.push(
        <ListItem key={1} disableGutters>
          <ListItemText
            primary="Current expansion"
            secondary={
              <>
                {pitch.expansionFocus.map((i, index) => (
                  <NeoChip
                    key={index}
                    label={regions.find((ii) => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
      );
    if (pitch.upcomingExpansionFocus)
      items.push(
        <ListItem key={2} disableGutters>
          <ListItemText
            primary="Upcoming expansion"
            secondary={
              <>
                {pitch.upcomingExpansionFocus.map((i, index) => (
                  <NeoChip
                    key={index}
                    label={regions.find((ii) => ii.value === i).label}
                    variant="outlined"
                  />
                ))}
              </>
            }
          />
        </ListItem>
      );
    if (pitch.longTermExpansionFocus)
      items.push(
        <ListItem key={3} disableGutters>
          <ListItemText
            primary="Long term expansion"
            secondary={
              <>
                {pitch.longTermExpansionFocus.map((i, index) => (
                  <NeoChip
                    key={index}
                    label={regions.find((ii) => ii.value === i).label}
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
      <Typography variant="h3">Expansion focus</Typography>
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
      expansionFocus: pitch.expansionFocus ? pitch.expansionFocus : [],
      upcomingExpansionFocus: pitch.upcomingExpansionFocus
        ? pitch.upcomingExpansionFocus
        : [],
      longTermExpansionFocus: pitch.longTermExpansionFocus
        ? pitch.longTermExpansionFocus
        : [],
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">What is your expansion focus?</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>
          <FormikMultiSelect
            options={regions}
            label="Current expansion"
            name="expansionFocus"
            formikProps={formik}
          />
          <FormikMultiSelect
            options={regions}
            label="Upcoming expansion"
            name="upcomingExpansionFocus"
            formikProps={formik}
          />
          <FormikMultiSelect
            options={regions}
            label="Long term expansion"
            name="longTermExpansionFocus"
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
        </form>
      </Grid>
    </>
  );
};
