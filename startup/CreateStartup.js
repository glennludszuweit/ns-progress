import React from 'react';
import { makeStyles } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import FormikTextField from '../FormikTextField';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import { areRequired } from '../../utils/validation';
import { maxCharacterLength } from '../../utils/validation';
import gql from 'graphql-tag';
import DialogTitle from '@material-ui/core/DialogTitle';
import ProgressButton from '../Button';
import Button from '@material-ui/core/Button';
import Router from 'next/router';
import {
  getClaimableStartups,
  searchQuery,
} from '../../apollo/utils/generalQueries';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from '../Link';

const useStyles = makeStyles(() => ({
  subTitle: { marginTop: '20px' },
  button: {
    float: 'right',
  },
}));

const lengthChecks = [
  { key: 'name', length: maxCharacterLengthConstants.DEFAULT_SHORT },
];
const requiredProps = ['name'];

const CREATE_STARTUP = gql`
  mutation createStartup($name: String!) {
    createStartup(name: $name) {
      _id
    }
  }
`;

export default () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [queryClaimableStartups, { data: csData }] = useLazyQuery(
    getClaimableStartups
  );
  const [createStartup, { data, loading }] = useMutation(CREATE_STARTUP, {
    refetchQueries: [
      {
        query: searchQuery,
        variables: {
          filters: [
            { key: 'category', values: ['startups'] },
            { key: 'admin', values: ['true'] },
          ],
        },
      },
    ],
  });
  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const formik = useFormik({
    onSubmit: async (values) => {
      try {
        const response = await createStartup({
          variables: {
            name: values.name,
          },
        });
        const startup = response.data.createStartup;
        setOpen(false);
        Router.push(
          '/startup/[_id]/profile',
          `/startup/${startup._id}/profile`
        );
      } catch (e) {
        formik.setFieldError('name', 'Internal error');
      }
    },
    validate: (values) => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      areRequired(values, errors, requiredProps);
      return errors;
    },
    initialValues: {
      name: '',
    },
  });

  return (
    <>
      <Button
        size="small"
        className={classes.button}
        onClick={() => {
          setOpen(true);
          queryClaimableStartups();
        }}
      >
        Create
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Add a company</DialogTitle>
          <DialogContent>
            <FormikTextField
              name="name"
              label="Company name"
              props={formik}
              fullWidth
              text
            />

            {csData &&
              csData.claimableStartups &&
              csData.claimableStartups.length > 0 && (
                <>
                  <Typography variant="subtitle1" className={classes.subTitle}>
                    Do you want to claim an existing company from our database?
                  </Typography>
                  <List dense>
                    {csData.claimableStartups.map((s, i) => (
                      <ListItem key={i}>
                        <Link
                          href="/startup/[_id]/profile"
                          as={`/startup/${s._id}/profile`}
                        >
                          <ListItemText primary={s.name} />
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
          </DialogContent>
          <DialogActions>
            <Button size="small" onClick={handleClose}>
              Cancel
            </Button>
            <ProgressButton
              size="small"
              loading={loading}
              successful={!!data}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Create
            </ProgressButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
