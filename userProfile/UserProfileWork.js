import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '../Button';
import FormikTextField from '../FormikTextField';
import FormikPlaceInput from '../FormikPlaceInput';
import FormikDatepicker from '../FormikDatepicker';
import FormikSelect from '../FormikSelect';
import FormikSwitch from '../FormikSwitch';
import Typography from '@material-ui/core/Typography';
import positions from '../../../common/positions/index';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  gridWithPaddingRight: {
    paddingRight: '10px',
  },
  gridWithPaddingRightMarginLeft: {
    paddingRight: '10px',
    marginLeft: '10px',
  },
  deleteButton: {
    marginLeft: '10px',
    fontSize: '12px',
    verticalAlign: 'sub',
    paddingBottom: '5px',
    cursor: 'pointer',
  },
  workDates: {
    fontSize: '13px',
  },
}));

const UserProfileWork = ({
  updateUser,
  user,
  readonly,
  index,
  refetchUser,
  onDelete,
  loading,
  data,
}) =>
  readonly
    ? readable({ user })
    : writeable({
        user,
        updateUser,
        loading,
        refetchUser,
        onDelete,
        index,
        data,
      });

function writeable({
  user,
  data,
  updateUser,
  refetchUser,
  index,
  loading,
  onDelete,
}) {
  const classes = useStyles();
  const formik = useFormik({
    onSubmit: async values => {
      const w = { ...values };
      if (w.location) delete w.location.__typename;
      delete w.__typename;
      console.log(w);
      updateUser(w, index);
      await refetchUser();
    },
    initialValues: {
      title: user.title ? user.title : 'hello',
      company: user.company ? user.company : '',
      startDate: user.startDate ? user.startDate : Date.now(),
      endDate: user.endDate ? user.endDate : Date.now(),
      presentlyWorking: user.presentlyWorking ? user.presentlyWorking : false,
      location: user.location ? user.location : null,
    },
  });

  return (
    <Grid item xs={12} sm={12}>
      <form onSubmit={formik.handleSubmit}>
        <FormikSelect
          options={positions}
          label="Position"
          name="title"
          formikProps={formik}
          selectProps={{
            //  disabled: formik.values.category !== 'users',
            groupBy: option => option.group.label,
            value: formik.values.title
              ? positions.find(o => o.totalValue === formik.values.title)
              : '',
            onChange: (_, newValue) => {
              if (newValue === null) newValue = '';
              formik.setFieldValue('title', newValue.totalValue);
            },
          }}
        />
        <FormikTextField
          name="company"
          label="Company"
          props={formik}
          fullWidth
        />
        <FormikPlaceInput formik={formik} name="location" label="Location" />

        <Grid container wrap="nowrap" alignItems="center">
          <Grid item xs={5} sm={5} className={classes.gridWithPaddingRight}>
            <FormikDatepicker
              format="DD/MM/YYYY"
              id="startDate"
              name="startDate"
              label="Start Date"
              props={formik}
            />
          </Grid>
          <Grid item xs={5} sm={5} className={classes.gridWithPaddingRight}>
            {!formik.values.presentlyWorking && (
              <FormikDatepicker
                format="DD/MM/YYYY"
                id="endDate"
                name="endDate"
                label="End Date"
                props={formik}
              />
            )}
          </Grid>
          <Grid
            className={classes.gridWithPaddingRightMarginLeft}
            item
            xs={2}
            sm={2}
          >
            <FormikSwitch
              fullWidth
              name="presentlyWorking"
              label="Present"
              formikProps={formik}
            />
          </Grid>
        </Grid>

        <Button
          size="small"
          loading={loading}
          successful={data}
          disabled={!(formik.isValid && formik.dirty)}
        >
          Update
        </Button>
        <span className={classes.deleteButton} onClick={() => onDelete(index)}>
          Delete
        </span>
      </form>
    </Grid>
  );
}

function readable({ user }) {
  const classes = useStyles();
  var start = moment(user.startDate); //
  var end = moment(user.endDate); // another date
  var duration = moment.duration(start.diff(end));
  var timeSpent = duration.asMonths();
  var displayedDuration = Math.round(Math.abs(timeSpent));
  var suffix = '';

  const getDuration = () => {
    if (displayedDuration <= 12) {
      console.log('month');
      suffix = displayedDuration > 1 ? 'months' : 'month';
      return Math.round(Math.abs(duration.asMonths())) + ' ' + suffix;
    } else {
      console.log('year');
      suffix = displayedDuration > 1 ? 'years' : 'year';
      return Math.round(Math.abs(duration.asYears())) + ' ' + suffix;
    }
  };

  return (
    <>
      {user ? (
        <List key={user._id}>
          <ListItem disableGutters>
            <ListItemText>
              <Typography variant="h4" component="h6">
                {user.title &&
                positions.find(ii => ii.totalValue === user.title)
                  ? positions.find(ii => ii.totalValue === user.title).label
                  : null}
              </Typography>
              {user.company} <br />
              <Typography
                className={classes.workDates}
                variant="caption"
                component="p"
              >
                {moment(user.startDate).format('LL')} -{' '}
                {user.presentlyWorking
                  ? 'Present'
                  : moment(user.endDate).format('LL')}{' '}
                {getDuration()} <br />
                {user.location && user.location.formattedAddress}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      ) : (
        <p>Currently no information.</p>
      )}
    </>
  );
}
export default UserProfileWork;
