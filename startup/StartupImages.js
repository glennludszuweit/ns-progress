import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { updateStartupQuery } from '../../apollo/utils/generalQueries';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import Uploader from '../Uploader';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

export default ({ startup, refetchStartup, readonly }) =>
  readonly ? readable({ startup }) : writeable({ startup, refetchStartup });

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
    height: 315,
    backgroundPosition: 'inherit',
  },
}));

function writeable({ startup, refetchStartup }) {
  const classes = useStyles();
  const [updateStartup] = useMutation(updateStartupQuery);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const setUrl = async update => {
    await updateStartup({
      variables: {
        _id: startup._id,
        startup: update,
      },
    });
    await refetchStartup();
  };
  return (
    <>
      <Uploader
        menuId="logo-uploader"
        setShowSpinner={setShowSpinner}
        uploadFinished={url => {
          setUrl({
            logoUrl: url,
          });
        }}
        renderImage={(setAnchorEl, openUploadDialog) => (
          <Tooltip title="Select your logo">
            <Avatar
              src={startup.logoUrl ?? '/logo_placeholder.svg'}
              className={classes.avatar}
              onClick={event => {
                if (!startup.avatarUrl) openUploadDialog();
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
              setUrl({ bannerUrl: url });
            }}
            renderImage={(setAnchorEl, openUploadDialog) => (
              <CardActionArea
                onClick={event => {
                  if (!startup.bannerUrl) openUploadDialog();
                  else setAnchorEl(event.currentTarget);
                }}
              >
                {showSpinner && (
                  <CircularProgress className={classes.spinner} />
                )}
                {!startup.bannerUrl && (
                  <Tooltip title="Select your banner recommended size 600px x 315px">
                    <CardContent>
                      <CardMedia
                        component="img"
                        height={'315px'}
                        className={classes.media}
                        src="/banner_placeholder.svg"
                      />
                    </CardContent>
                  </Tooltip>
                )}
                {startup.bannerUrl && (
                  <CardMedia component="img" image={startup.bannerUrl} />
                )}
              </CardActionArea>
            )}
          />
        </Card>
      </Grid>
    </>
  );
}

function readable({ startup }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={12}>
      <Card className={classes.readableRoot}>
        <CardActionArea>
          <CardMedia
            image={startup.bannerUrl || 'url/image'}
            className={classes.readableMedia}
          />
          <Avatar className={classes.readableAvatar} src={startup.logoUrl} />
        </CardActionArea>
      </Card>
    </Grid>
  );
}
