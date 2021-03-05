import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core';
import Uploader from '../Uploader';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';

export default ({ user, updateUser, readonly, avatarTitle, placeholder }) =>
  readonly
    ? readable({ user })
    : writeable({ user, updateUser, avatarTitle, placeholder });

const useStyles = makeStyles(theme => ({
  avatar: {
    height: '70px',
    width: '70px',
    margin: '20px 0',
    cursor: 'pointer',
  },
  media: {
    height: '315px',
  },
  spinner: {
    position: 'absolute',
    right: '50%',
    top: '45%',
  },
  cardActionArea: {
    height: '315px',
  },
  readableRoot: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  readableAvatar: {
    position: 'absolute',
    top: '50px',
    left: '30px',
    zIndex: '999',
    width: '70px',
    height: '70px',
    zIndex: '1',
  },
  readableMedia: {
    height: 350,
    backgroundPosition: 'inherit',
  },
}));

function writeable({
  user,
  updateUser,
  avatarTitle = 'Select your avatar',
  placeholder = '/avatar_placeholder.svg',
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const classes = useStyles();

  return (
    <>
      <Uploader
        menuId="logo-uploader"
        setShowSpinner={setShowSpinner}
        uploadFinished={url => {
          updateUser({
            avatarUrl: url,
          });
        }}
        renderImage={(setAnchorEl, openUploadDialog) => (
          <Tooltip title={avatarTitle}>
            <Avatar
              src={user.avatarUrl ?? placeholder}
              className={classes.avatar}
              onClick={event => {
                if (!user.avatarUrl) openUploadDialog();
                else setAnchorEl(event.currentTarget);
              }}
            />
          </Tooltip>
        )}
      />
      <Grid item xs={12} sm={12}>
        <Card className={classes.card}>
          <Uploader
            menuId="banner-uploader"
            setShowSpinner={setShowSpinner}
            uploadFinished={url => {
              updateUser({ bannerUrl: url });
            }}
            renderImage={(setAnchorEl, openUploadDialog) => (
              <CardActionArea
                onClick={event => {
                  if (!user.bannerUrl) openUploadDialog();
                  else setAnchorEl(event.currentTarget);
                }}
                className={classes.cardActionArea}
              >
                {showSpinner && (
                  <CircularProgress className={classes.spinner} />
                )}
                {!user.bannerUrl && (
                  <Tooltip title="Select your banner recommended size 600px x 315px">
                    <CardContent>
                      <CardMedia
                        component="img"
                        height={'315px'}
                        src="/banner_placeholder.svg"
                        className={classes.media}
                      />
                    </CardContent>
                  </Tooltip>
                )}
                {user.bannerUrl && (
                  <CardMedia component="img" image={user.bannerUrl} />
                )}
              </CardActionArea>
            )}
          />
        </Card>
      </Grid>
    </>
  );
}

function readable({ user }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={12}>
      <Card className={classes.readableRoot}>
        <CardActionArea>
          <CardMedia
            image={user.bannerUrl || 'url/image'}
            className={classes.readableMedia}
          />
          <Avatar className={classes.readableAvatar} src={user.avatarUrl} />
        </CardActionArea>
      </Card>
    </Grid>
  );
}
