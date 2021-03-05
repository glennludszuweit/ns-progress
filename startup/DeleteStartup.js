import React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import DialogTitle from '@material-ui/core/DialogTitle';
import ProgressButton from '../Button';
import Button from '@material-ui/core/Button';
import Router from 'next/router';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { searchQuery } from '../../apollo/utils/generalQueries';

const DELETE_STARTUP = gql`
  mutation deleteStartup($_id: ObjectId!) {
    deleteStartup(_id: $_id)
  }
`;

export default ({ startup }) => {
  const [open, setOpen] = React.useState(false);
  const [_deleteStartup, { data, loading }] = useMutation(DELETE_STARTUP, {
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

  const deleteStartup = async () => {
    try {
      await _deleteStartup({
        variables: {
          _id: startup._id,
        },
      });
      Router.push('/garage');
    } catch (e) {
      console.log(e);
      //todo open dialog with error
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Divider />
      <Typography variant="h3">Delete</Typography>
      <Grid item xs={12} sm={12}>
        <Typography variant="body2">
          This will delete and remove your startup profile with all its information and data from our system.
        </Typography>
        <Button size="small" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this profile: {startup.name}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose}>
            Cancel
          </Button>
          <ProgressButton
            size="small"
            loading={loading}
            successful={!!data}
            onClick={deleteStartup}
          >
            Delete
          </ProgressButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
