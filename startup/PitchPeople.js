import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { maxCharacterLength } from '../../utils/validation';
import { updatePitchQuery, updateStartupQuery, } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import ReactPlayer from 'react-player';
import isValidURI from '../../../common/isValidURI';
import Select from '../Select';
import investorInvolvement from '../../../common/investorInvolvement';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';

const lengthChecks = [
  {
    key: 'team',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'advisors',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'help',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'investorDescription',
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
    if (pitch.team)
      items.push(
        <ListItem key={1} disableGutters>
          <ListItemText primary="Team" secondary={pitch.team} />
        </ListItem>
      );
    if (pitch.advisors)
      items.push(
        <ListItem key={2} disableGutters>
          <ListItemText primary="Advisor(s)" secondary={pitch.advisors} />
        </ListItem>
      );
    if (pitch.help)
      items.push(
        <ListItem key={3} disableGutters>
          <ListItemText primary="Current pain" secondary={pitch.help} />
        </ListItem>
      );
    if (pitch.investorInvolvement)
      items.push(
        <ListItem key={4} disableGutters>
          <ListItemText
            primary="Ideal investor involvement"
            secondary={
              investorInvolvement.find(
                (s) => s.value === pitch.investorInvolvement
              ).label
            }
          />
        </ListItem>
      );
    if (pitch.investorDescription)
      items.push(
        <ListItem key={5} disableGutters>
          <ListItemText
            primary="Dream investor or partner"
            secondary={pitch.investorDescription}
          />
        </ListItem>
      );
    setItems(items);
  }, [startup]);

  return (
    <>
      <Divider />
      <Typography variant="h3">People behind the scenes</Typography>
      {items.length > 0 && <List>{items}</List>}
      {items.length < 1 && !pitch.videoUrl && (
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
      if (values.videoUrl !== '' && !isValidURI(values.videoUrl))
        return { videoUrl: 'No valid uri.' };
      return errors;
    },
    initialValues: {
      team: pitch.team ? pitch.team : '',
      advisors: pitch.advisors ? pitch.advisors : '',
      help: pitch.help ? pitch.help : '',
      investorInvolvement: pitch.investorInvolvement
        ? pitch.investorInvolvement
        : '',
      investorDescription: pitch.investorDescription
        ? pitch.investorDescription
        : '',
      videoUrl: pitch.videoUrl ? pitch.videoUrl : '',
    },
  });

  return (
    <>
      <Divider />
      <Typography variant="h3">People behind the scenes</Typography>
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>

        <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="team"
            label="Team"
            helperText="What makes your team so special?"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. Founder and CEO Ibn Battutah previously founded and sold the app Mapify, mapping on demand. He has a background in business development and innovation. Ibn Battutah has lived in NEO City his entire life, is son of the major and has a large network in the city. Founder and CTO Avicenna Ibn Sina was the founding CTO of KnowHow, a education management tool for teachers, later sold to WikiNow. He has a background in computer engineering. Avicenna moved to NEO City to study. He rides his bike everywhere and rely on it constantly."
          />
          <Tooltip title="Tell the story of your founders and key team members and how will there experience aid in your success?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="advisors"
            label="Advisors"
            helperText="A board of advisors gives your company value and trust"
            props={formik}
            fullWidth
            multiline
            placeholder="An advisor is basically anyone who can de-risk your startup for investors by endorsing your venture and giving you advice. Creating an advisory board is a great way to invite industry leaders into an ongoing relationship with your company so they can be partners in your success or they can be sounding boards, provide introductions to prospective funders and clients, and they can provide public validation for your business. Choose the right one!"
          />
          <Tooltip title="An advisor is basically anyone who can de-risk your startup for investors by endorsing your venture and giving you advice. Creating an advisory board is a great way to invite industry leaders into an ongoing relationship with your company so they can be partners in your success or they can be sounding boards, provide introductions to prospective funders and clients, and they can provide public validation for your business. Choose the right one!" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="help"
            label="Current pain"
            helperText="How can we help or support you?"
            props={formik}
            fullWidth
            multiline
            placeholder="Tell us about your current pain and how can we support you to reach your next milestone?
            What are you struggling with the most?"
          />
          <Tooltip title="Tell us about your current pain and how can we support you to reach your next milestone? What are you struggling with the most?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <Select
            props={formik}
            label="Ideal investor involvement"
            name="investorInvolvement"
            id="financialStatus"
            options={investorInvolvement}
          />
          <Tooltip title="What is the right investor involvement you wish?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="investorDescription"
            label="Dream investor or partner"
            helperText="Is there a particular investor or firm that makes you interested in meeting with them?"
            props={formik}
            fullWidth
            multiline
            placeholder="Which investor, expert or corporate may help you to accelerate your business?"
          />
          <Tooltip title="Is there a particular investor or firm that makes you interested in meeting with them? Which investor, expert or corporate may help you to accelerate your business?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <FormikTextField
            name="videoUrl"
            label="Pitch video"
            placeholder="Please add a ~2 minute pitch video with your core team, explain what you do and why you are a great fit for your business. Tell us something about yourself, your company and product. Add a video link from YouTube, Vimeo etc."
            props={formik}
            multiline
            fullWidth
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
