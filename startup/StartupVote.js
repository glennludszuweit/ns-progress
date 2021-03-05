import React from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getCurrentUser, getVotes } from '../../apollo/utils/userDataUtils';
import { useMutation } from '@apollo/react-hooks';
import {
  updateUserQuery,
  updateNotificationsQuery,
} from '../../apollo/utils/generalQueries';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  votes: {
    fontSize: '10px',
  },
  IconAndVotes: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'lightgrey !important',
      borderRadius: '5px',
    },
  },
}));

function StartupVote({ startupId, startupAdmins }) {
  const { user, loading, refetch } = getCurrentUser();
  const { votes, refetch: refetchVotes } = getVotes(startupId);
  console.log(votes);
  const [updateUser] = useMutation(updateUserQuery);

  const [updateNotification, { data }] = useMutation(updateNotificationsQuery);
  const classes = useStyles();

  const sendNotification = async () => {
    let sender = await user._id;
    let receiver = await startupAdmins[0];
    await updateNotification({
      variables: {
        data: {
          from: sender,
          to: receiver,
          createdAt: new Date(),
          type: 'vote',
          label: user.firstName,
          avatar: user.avatarUrl,
        },
      },
    });
  };

  const updateCoins = async () => {
    let coins = await user.coins;
    let c = { ...coins };
    delete c.__typename;
    delete coins.__typename;
    c.receivedFromStartupVotes
      ? c.receivedFromStartupVotes
      : (c.receivedFromStartupVotes = []);
    let alreadyVotedBefore =
      (await c.receivedFromStartupVotes.filter(id => id === startupId).length) >
      0;

    //same user check to get coins
    if (!alreadyVotedBefore) {
      c.total += 1;
      c.receivedFromStartupVotes.push(startupId);
      return c;
    } else {
      return coins;
    }
  };
  const onUpClick = async () => {
    // alert('Up voted');
    let newCoins = await updateCoins();
    let userId = await user._id;
    let sv = (await user.startupVotes) || { up: [], down: [] };
    if (sv) delete sv.__typename;
    let alreadyUpVoted = sv.up && sv.up.some(id => id === startupId);
    const up = [...sv.up];
    const down = await sv.down.filter(id => id !== startupId);
    if (!alreadyUpVoted) {
      up.push(startupId);
      console.log('pushed');
      let startupVotes = { up, down };
      console.log(startupVotes);
      await updateUser({
        variables: {
          _id: userId,
          user: { startupVotes, coins: newCoins },
        },
      });

      await sendNotification();
      await refetch();
      await refetchVotes();
    } else {
      alert('already up voted');
    }
  };

  const onDownClick = async () => {
    //alert('Down voted');
    let newCoins = await updateCoins();
    let userId = await user._id;
    let sv = (await user.startupVotes) || { up: [], down: [] };
    if (sv) delete sv.__typename;
    let alreadyDownVoted =
      sv['down'] && sv['down'].some(id => id === startupId);
    const up = await sv.up.filter(id => id !== startupId);
    const down = [...sv.down];
    if (!alreadyDownVoted) {
      down.push(startupId);
      console.log('pushed');
      let startupVotes = { up, down };
      console.log(startupVotes);
      await updateUser({
        variables: {
          _id: userId,
          user: { startupVotes, coins: newCoins },
        },
      });
      await sendNotification();
      await refetch();
      await refetchVotes();
    } else {
      alert('already up voted');
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.IconAndVotes}>
        <span className={classes.votes}>{votes && votes.up}</span>
        <ArrowDropUpIcon onClick={onUpClick} className={classes.icon} />
      </div>
      <div className={classes.IconAndVotes}>
        <span className={classes.votes}>{votes && votes.down}</span>
        <ArrowDropDownIcon onClick={onDownClick} className={classes.icon} />
      </div>
    </div>
  );
}

export default StartupVote;
