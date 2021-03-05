import Button from '../Button';
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AccessLinkIcon from '@material-ui/icons/VpnLockTwoTone';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import isEmailValid from '../../../common/isEmailValid';
import FormikTextField from '../FormikTextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Collapse, Divider } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'; 
import Radio from '@material-ui/core/Radio';
import Card from '@material-ui/core/Card';
import CopyIcon from '@material-ui/icons/FileCopyTwoTone';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';
import Link from '../../../fe/components/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import getConfig from 'next/config';
import { makeStyles } from '@material-ui/styles';
const { publicRuntimeConfig } = getConfig();


const useStyles = makeStyles(() => ({
  cardContent: { minHeight: '100px' },
  cardInviteButton: { marginTop: 0 },
  switchToggle: { marginRight: '5px' }
}));

const DELETE_INVITATION = gql`
  mutation deletePitchAccessInvitation(
    $startupId: ObjectId!
    $invitationId: String!
  ) {
    deletePitchAccessInvitation(
      startupId: $startupId
      invitationId: $invitationId
    )
  }
`;

const DELETE_MEMBER = gql`
  mutation deletePitchAccessMember(
    $startupId: ObjectId!
    $memberId: ObjectId!
  ) {
    deletePitchAccessMember(startupId: $startupId, memberId: $memberId)
  }
`;

const TOGGLE_ACCESS = gql`
  mutation togglePitchAccess(
    $startupId: ObjectId!
    $enabled: Boolean!
    $memberId: ObjectId
  ) {
    togglePitchAccess(
      startupId: $startupId
      memberId: $memberId
      enabled: $enabled
    )
  }
`;

function formatDate(date) {
  return moment(date).format('DD.MM.YYYY');
}

export default ({ startup, refetchStartup }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const pitchAccess = startup.pitchAccess || {};

  const [deleteInvitationMutation] = useMutation(DELETE_INVITATION);
  const deleteInvitation = async (invitation) => {
    await deleteInvitationMutation({
      variables: { startupId: startup._id, invitationId: invitation.shortId },
    });
    await refetchStartup();
  };

  const [deleteMemberMutation] = useMutation(DELETE_MEMBER);
  const deleteMember = async (member) => {
    await deleteMemberMutation({
      variables: { startupId: startup._id, memberId: member.user._id },
    });
    await refetchStartup();
  };

  const [toggleAccess] = useMutation(TOGGLE_ACCESS);
  const toggleMemberAccess = async (member) => {
    await toggleAccess({
      variables: {
        startupId: startup._id,
        memberId: member.user._id,
        enabled: !member.enabled,
      },
    });
    await refetchStartup();
  };
  const toggleGlobalAccess = async () => {
    await toggleAccess({
      variables: {
        startupId: startup._id,
        enabled: !pitchAccess.enabled,
      },
    });
    await refetchStartup();
  };

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Manage access
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Manage access</DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent className={classes.cardContent}>
                  <Typography variant="body2">
                    Enable or disable the general access to your pitch deck.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Switch
                    onClick={() => toggleGlobalAccess()}
                    checked={pitchAccess.enabled}
                    edge="end"
                    color='primary'
                  />
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent className={classes.cardContent}>
                  <Typography variant="body2">
                    Invite more people to read your pitch deck and get feedback.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => setOpenCreate(true)}
                    size="small"
                    className={classes.cardInviteButton}
                  >
                    Invite
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          <Collapse in={openCreate}>
            <Invite
              startup={startup}
              refetchStartup={refetchStartup}
              onFinished={() => setOpenCreate(false)}
            />
          </Collapse>
          {pitchAccess.members && pitchAccess.members.length > 0 && (
            <List
              dense
              subheader={<ListSubheader component="div">User</ListSubheader>}
            >
              {pitchAccess.members.map((m, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <Link
                  href="/user/[_id]/profile"
                  as={`/user/${m.user._id}/profile`}
                  >                  
                  <ListItemText
                    primary={`${m.user.firstName} ${m.user.lastName}`}
                  />
                  </Link>
                  <ListItemSecondaryAction>
                    <Switch
                      onClick={() => toggleMemberAccess(m)}
                      checked={m.enabled}
                      className={classes.switchToggle}
                      color='primary'
                    />
                    <Tooltip title="Delete access">
                      <IconButton edge="end" onClick={() => deleteMember(m)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          {pitchAccess.invitations && pitchAccess.invitations.length > 0 && (
            <List
              subheader={<ListSubheader component="div">Invited via Link</ListSubheader>}
            >
              {pitchAccess.invitations.map((i, index) => {
                const isLink = !i.user && !i.email;
                return (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <AccessLinkIcon />
                    </ListItemAvatar>
                    {i.email && (
                      <ListItemText
                        primary={i.email}
                        secondary={formatDate(i.date)}
                      />
                    )}
                    {i.user && (
                      <ListItemText
                        primary={`${i.user.firstName} ${i.user.lastName}`}
                        secondary={formatDate(i.date)}
                      />
                    )}
                    {isLink && (
                      <ListItemText
                        primary="Shared link"
                        secondary={formatDate(i.date)}
                      />
                    )}
                    <ListItemSecondaryAction>
                      {isLink && (
                        <Tooltip title="Copy link">
                          <CopyToClipboard
                            text={`${publicRuntimeConfig.baseUrl}/accept-invitation?id=${i.shortId}`}
                          >
                            <IconButton>
                              <CopyIcon />
                            </IconButton>
                          </CopyToClipboard>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete invitation">
                        <IconButton
                          edge="end"
                          onClick={() => deleteInvitation(i)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const INVITE = gql`
  mutation invitePitchAccessMember(
    $startupId: ObjectId!
    $type: PitchAccessInvitationType!
    $email: Email
    $userId: ObjectId
  ) {
    invitePitchAccessMember(
      startupId: $startupId
      type: $type
      email: $email
      userId: $userId
    ) {
      shortId
    }
  }
`;

const Invite = ({ startup, refetchStartup, onFinished }) => {
  const [invite, { data, loading }] = useMutation(INVITE);
  const formik = useFormik({
    onSubmit: async (values, { setFieldError }) => {
      await invite({
        variables: {
          startupId: startup._id,
          type: values.type,
          email: values.email && values.email !== '' ? values.email : undefined,
        },
      });
      await refetchStartup();
      if (onFinished) onFinished();
    },
    validate: (values) => {
      let errors = {};
      if (values.type === 'EMAIL' && !isEmailValid(values.email))
        errors.email = 'Invalid email address.';
      return errors;
    },
    initialValues: {
      email: '',
      type: 'EMAIL',
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          name="type"
          value={formik.values.type}
          onChange={(e) => formik.setFieldValue('type', e.target.value)}
        >
          <FormControlLabel
            value="EMAIL"
            control={<Radio />}
            label="Invite investor via email"
          />
          <FormControlLabel
            value="LINK"
            control={<Radio />}
            label="Create a shareable link"
          />
          <FormikTextField
            name="email"
            label="Email"
            props={formik}
            fullWidth
            autoFocus
            disabled={formik.values.type === 'LINK'}
          />
        </RadioGroup>
      </FormControl>
      <br />
      <Button
        size="small"
        loading={loading}
        successful={!!data}
        disabled={!(formik.isValid && formik.dirty)}
      >
        Invite
      </Button>
      <Divider />
    </form>
  );
};
