import React, { useEffect } from 'react';
import Section from '../Section';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import FormikPlaceInput from '../FormikPlaceInput';
import Select from '../Select';
import FormikMultiSelect from '../FormikMultiSelect';
import expertTypes from '../../../common/industries';
import skills from '../../../common/skills/index';
import { makeStyles } from '@material-ui/core';
import ViewListIcon from '@material-ui/icons/FormatListBulletedRounded';
import ViewModuleIcon from '@material-ui/icons/ContactsRounded';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(() => ({
  gridClass: {
    width: 'auto',
  },
  toggleButton:{
    border:'none'
  }
}));

const StartupListFilter = ({ setCardView, cardView, loading, onSubmit }) => {
  const classes = useStyles();

  const formik = useFormik({
    onSubmit,
    initialValues: {
      search: '',
      country: '',
      category: 'allusers',
      expertTypes: [],
      skills: [],
    },
  });
  
  useEffect(() => {
    formik.handleSubmit();
    localStorage.setItem('category', formik.values.category)
  }, [formik.values.category]);


  return (
    <form onSubmit={formik.handleSubmit}>
      <Section
        justify="flex-start"
        gridClass={classes.gridClass}
        containerClass={classes.containerClass}
      >
        <Grid item xs={12} sm={8} md={3}>
          <Select
            props={formik}
            label="Category"
            id="category"
            name="category"
            options={[
              { label: 'All members', value: 'allusers' },
              { label: 'Experts', value: 'users' },
              { label: 'Company', value: 'startups' },
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <FormikTextField
            name="search"
            id="search"
            label={
              formik.values.category === 'startups'
                ? 'Company name'
                : formik.values.category === 'users'
                ? 'Expert name'
                : 'Name'
            }
            props={formik}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={8} md={3}>
          <FormikPlaceInput
            formik={formik}
            name="country"
            id="country"
            label="Country"
            countryMode={true}
          />
        </Grid>
        <Grid item xs={12} sm={8} md={5}>
          {formik.values.category === 'users' && (
            <FormikMultiSelect
              disabled={formik.values.category !== 'users'}
              selectProps={{ disabled: formik.values.category !== 'users' }}
              options={expertTypes}
              label="Expert type"
              name="expertTypes"
              formikProps={formik}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={8} md={4}>
          {formik.values.category === 'users' && (
            <FormikMultiSelect
              options={skills}
              label="Expert skillset"
              name="skills"
              formikProps={formik}
              selectProps={{
                disabled: formik.values.category !== 'users',
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
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={3}
          container
          justify="space-around"
          alignItems="flex-end"
        >
          <ToggleButtonGroup
            orientation="vertical"
            value={cardView}
            exclusive
            onChange={() => setCardView(!cardView)}
          >
            <ToggleButton value="list" aria-label="list"
            className={classes.toggleButton}
            >
              {cardView ? <ViewModuleIcon /> : <ViewListIcon />}
            </ToggleButton>
          </ToggleButtonGroup>
          <Button loading={loading} size="small">
            Search
          </Button>
        </Grid>
      </Section>
    </form>
  );
};
export default StartupListFilter;
