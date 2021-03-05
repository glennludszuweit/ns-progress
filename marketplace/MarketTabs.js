import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import SwipeableViews from 'react-swipeable-views';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/InfoTwoTone';
import Typography from '@material-ui/core/Typography';
import Shop from './Shop';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    alignItems: 'flex-start',
  },
  iconAndInfoText: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  infoText: {
    paddingLeft: '10px',
    fontSize: '12px',
  },
  tabBox: {
    paddingTop: '24px' 
  },
}));


function TabPanel(props) {
  const classes = useStyles()
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabBox}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            label={'Shop'}
            {...a11yProps(0)}
            classes={{ wrapper: classes.wrapper }}
          />
          <Tab
            label={'Products'}
            {...a11yProps(1)}
            classes={{ wrapper: classes.wrapper }}
          />
          <Tab
            label={'Services'}
            {...a11yProps(2)}
            classes={{ wrapper: classes.wrapper }}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        slideStyle={{ overflow: 'hidden' }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className={classes.iconAndInfoText}>
            <Tooltip
              title="You need coins to purchase vitual goods in the shop"
              placement="top-start"
            >
              <HelpOutlineIcon />
            </Tooltip>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.infoText}
            >
              We will be adding step by step cool new stuff you can purchase in the shop.
            </Typography>
          </div>
          <Shop />
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
        <div className={classes.iconAndInfoText}>
            <Tooltip
              title="You need coins to purchase products in the marketplace."
              placement="top-start"
            >
              <HelpOutlineIcon />
            </Tooltip>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.infoText}
            >
              Find and discover cool new products in early and final stage.
            </Typography>
          </div>
          Starts soon...
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
        <div className={classes.iconAndInfoText}>
            <Tooltip
              title="You need coins to purchase services in the marketplace."
              placement="top-start"
            >
              <HelpOutlineIcon />
            </Tooltip>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.infoText}
            >
              Find services you are looking for, delivered by domain experts.
            </Typography>
          </div>
          Starts soon...
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
