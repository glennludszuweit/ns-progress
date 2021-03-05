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

const DELETE_USER = gql`
  mutation deleteUser($_id: ObjectId!) {
    deleteUser(_id: $_id)
  }
`;

export default ({ user }) => {
    const [open, setOpen] = React.useState(false);
    const [_deleteUser, { data, loading }] = useMutation(DELETE_USER)

    const handleClose = () => {
        if (loading) return;
        setOpen(false);
    };

    const deleteUser = async () => {
        try {
        await _deleteUser({
            variables: {
            _id: user._id,
            },
        });
        Router.reload()
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
      <Typography variant="h3">Delete Account</Typography>
      <Grid item xs={12} sm={12}>
        <Typography variant="body2">
          This will delete and remove your profile with all its information and data from our system.
        </Typography>
        <Button size="small" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete your NEOSTARTER Account?
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
            onClick={deleteUser}
          >
            Delete
          </ProgressButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
