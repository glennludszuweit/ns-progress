import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import FormikTextField from '../FormikTextField';
import Button from '../Button';
import { maxCharacterLength } from '../../utils/validation';
import { updatePitchQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import maxCharacterLengthConstants from '../../../common/maxCharacterLengthConstants';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';

const lengthChecks = [
  {
    key: 'shortDesc',
    length: maxCharacterLengthConstants.STARTUP_SHORT_DESC,
  },
  {
    key: 'solvedProblems',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'solutions',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'usp',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'competition',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
  {
    key: 'targetMarket',
    length: maxCharacterLengthConstants.STARTUP_LONG_DESC,
  },
];

function getBasicItems(startup) {
  const items = [];
  return items;
}

export default (props) => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ startup, pitch }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = getBasicItems(startup);

    if (pitch.shortDesc)
      items.push(
        <ListItem key={10} disableGutters>
          <ListItemText
            primary="Intro"
            secondary={pitch.shortDesc}
          />
        </ListItem>
      );
    if (pitch.solvedProblems)
      items.push(
        <ListItem key={11} disableGutters>
          <ListItemText
            primary="Target's problem(s)"
            secondary={pitch.solvedProblems}
          />
        </ListItem>
      );
    if (pitch.solutions)
      items.push(
        <ListItem key={12} disableGutters>
          <ListItemText primary="Solution(s)" secondary={pitch.solutions} />
        </ListItem>
      );
    if (pitch.usp)
      items.push(
        <ListItem key={13} disableGutters>
          <ListItemText primary="USP" secondary={pitch.usp} />
        </ListItem>
      );
    if (pitch.competition)
      items.push(
        <ListItem key={14} disableGutters>
          <ListItemText
            primary="Competition and alternatives"
            secondary={pitch.competition}
          />
        </ListItem>
      );
    if (pitch.targetMarket)
      items.push(
        <ListItem key={15} disableGutters>
          <ListItemText
            primary="Target market"
            secondary={pitch.targetMarket}
          />
        </ListItem>
      );
    
    setItems(items);
  }, [startup]);

  return (
    <>
      <Typography variant="h3">Business model</Typography>
      {items.length > 0 && <List>{items}</List>}
      {items.length < 1 && (
        <Typography variant="body1">Currently no information.</Typography>
      )}
    </>
  );
};

const writeable = ({ startup, pitch, refetchStartup }) => {
  const [updatePitch, { data, loading }] = useMutation(updatePitchQuery);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getBasicItems(startup));
  }, [startup]);

  const formik = useFormik({
    onSubmit: async (values) => {
      const p = { ...values };
      await updatePitch({
        variables: {
          _id: startup._id,
          pitch: p,
        },
      });
    },
    validate: (values) => {
      let errors = {};
      maxCharacterLength(values, errors, lengthChecks);
      return errors;
    },
    initialValues: {
      shortDesc: pitch.shortDesc ? pitch.shortDesc : '',
      solvedProblems: pitch.solvedProblems ? pitch.solvedProblems : '',
      solutions: pitch.solutions ? pitch.solutions : '',
      usp: pitch.usp ? pitch.usp : '',
      competition: pitch.competition ? pitch.competition : '',
      targetMarket: pitch.targetMarket ? pitch.targetMarket : '',
    },
  });

  return (
    <>
      <Typography variant="h3">Business model</Typography>
      {items.length > 0 && (
        <Grid item xs={12} sm={12}>
          <List>{items}</List>
        </Grid>
      )}
      <Grid item xs={12} sm={12}>
        <form onSubmit={formik.handleSubmit}>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="shortDesc"
            label="Elevator pitch"
            helperText="Engage your visitor in less than 75 words."
            props={formik}
            fullWidth
            multiline
            placeholder="An elevator statement is a short description of your idea, product, or company 
            that explains the concept in a way such that any listener can understand it in a short period of time. 
            Engage your listener and explain who you are and what you do in less than 75 words."
          />
          <Tooltip title="Keep the introduction short and precise. Begin with a quick explanation of the problem followed by your unique solution. 
          Then introduce the reader to the different aspects you are going to address in the pitch deck. Make sure what you are writing makes people want to read more. 
          Lots of active sentences, no long and dusty technical explanations." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="solvedProblems"
            label="Target's problem(s)"
            helperText="What problem(s) are you solving?"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. In NEO City 82% of all citizens ride their bikes to work. Still there are only five bike repair shops in the entire city. This makes it inconvenient and time consuming for people to have even the smallest damages repaired."
          />
          <Tooltip title="Describe the pain or need of your customer. How is this addressed today and what are the shortcomings to current solutions." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="solutions"
            label="Solution(s)"
            helperText="What solution(s) does your product offer to solve the problem stated above?"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. NEO City citizens not only need more bike repair shops but also extra convenience, fast repairs and access to high quality loaner bikes to get them to work when their own bikes fail."
          />
          <Tooltip title="Explain your eureka moment. Why is your value prop unique and compelling? Why will it endure? And where does it go from here? How do you make the customer's life better?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="usp"
            label="USP"
            helperText="Unique Selling Proposition"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. Our solution is a mobile app based solution that makes it click-easy for our users to get their bikes fixed anytime, anywhere in NEO City. Just tap the app, we'll show you where to find the nearest loaner, pick up your bike within two hours, repair the damages while you're at work and bring it right back to you."
          />
          <Tooltip title="What is your company's competitive or unfair advantage? This can include patents, first mover advantage, unique expertise, or proprietary processes/technology." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="competition"
            label="Competition and alternatives"
            helperText="Who are your competitors"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. Well-established bike repair shops in NEO City: Have gained customer loyalty throughout many years, but face challenges with capacity and convenience for users. Swapfiets: Subscription based bike rental service with free-of-charge repair. Users don't own their own bikes with Swapfiets."
          />
          <Tooltip title="Describe the competitive landscape and your competitors strengths and weaknesses. If direct competitors don't exist, describe the existing alternatives. Who are your direct and indirect competitors. What are the advantages of your product or service? How is your product or service better than your competition? How do you really differentiate from your competition? Show that you have a plan to win." placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

          <Grid container wrap='nowrap' alignItems='baseline' >
          <FormikTextField
            name="targetMarket"
            label="Target market"
            helperText="Who are you building this product for, what is your target group/market?"
            props={formik}
            fullWidth
            multiline
            placeholder="E.g. Segment 1: Students aged 20-30. Value convenience, and don't want to spend huge amounts of time waiting around in bike repair shops. Segment 2: Mid-level income workers aged 30-45. Health conscious, have busy lives and value efficiency. The bike repair market in NEO City is rapidly growing. Approximately 80% of the 2 million citizens in NEO City own a bike and rely on it to get around every day. Currently there are only four bike repair shops in the city."
          />
          <Tooltip title="Define the important geographic, demographic, and/or psychographic characteristics of the market within which your customer segments exist. Identify your customer and your market. Some of the best companies invent their own markets. What is the market opportunity and why will it be really big? Why might it be bigger than people think? Does it create a new market? Try to use external, trustworthy sources. Are you able to identify your early adopters?" placement="top-end">
              <HelpOutlineIcon />
            </Tooltip>
          </Grid>

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
