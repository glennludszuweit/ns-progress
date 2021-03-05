import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { updateCoinsQuery } from '../../apollo/utils/generalQueries';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '../Button';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  icon: {
    width: '100px',
  },
  titleAndIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  dialogTitle: { paddingBottom: 0 },
  coinsNotEnough: { color: 'red' },
  button: { marginRight: '13px' },
}));

function ProductDescriptionModal({
  open,
  title = 'Product',
  handleClose,
  Icon,
  description,
  productId,
  user,
  priceInCoins,
  refetch,
  isPlantATree,
}) {
  const classes = useStyles();
  const [updateCoins, { loading }] = useMutation(updateCoinsQuery);
  const totalCoins = user && user.coins && user.coins.total;
  const areCoinsEnough = totalCoins >= priceInCoins;
  console.log({ areCoinsEnough });
  const handlePurchase = async (purchasePrice, id) => {
    if (purchasePrice <= totalCoins) {
      let isCoinUpdated = (
        await updateCoins({
          variables: {
            data: { coins: purchasePrice, operation: 'minus', productId: id },
          },
        })
      ).data;
      if (isCoinUpdated.updateCoins) {
        console.log('now update the purchase');
      }
      await refetch();
      handleClose();
      isCoinUpdated = '';
    } else {
      alert('Coins are not enough, please top up. ');
    }
  };
  return (
    <Dialog open={open} title={title} onClose={handleClose} maxWidth="sm">
      <DialogTitle className={classes.dialogTitle}>
        <div className={classes.titleAndIcon}>
          <img src={Icon} className={classes.icon} />
          <span>{title}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" component="h6">
          {description}
        </Typography>
        {!areCoinsEnough && (
          <Typography
            variant="caption"
            component="h6"
            className={classes.coinsNotEnough}
          >
            Coins are not sufficient. Please top-up from coinbase.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={handleClose} className={classes.button}>
          Cancel
        </Button>
        <Button
          size="small"
          onClick={handleClose}
          className={classes.button}
          onClick={() => handlePurchase(priceInCoins, productId)}
          disabled={!areCoinsEnough || isPlantATree}
        >
          {isPlantATree ? 'Starts soon' : 'Purchase'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDescriptionModal;
