import { useMutation } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { updateUserQuery } from '../../apollo/utils/generalQueries';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core';
import Uploader from '../Uploader';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(() => ({
  avatar: {
    height: '40px',
    width: '40px',
    margin: '0px 0',
  },
}));

export default ({ user, refetchUser }) => {
  const classes = useStyles();
  const [updateUser] = useMutation(updateUserQuery);

  return (
    <Grid>
      <Uploader
        uploadFinished={async (url) => {
          await updateUser({
            variables: {
              _id: user._id,
              user: {
                avatarUrl: url,
              },
            },
          });
          await refetchUser();
        }}
        renderImage={(setAnchorEl, openUploadDialog) => (
          <Avatar
            src={user.avatarUrl ?? '/avatar_placeholder.svg'}
            className={classes.avatar}
          />
        )}
      />
    </Grid>
  );
};
