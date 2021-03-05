import React from 'react';
import Button from '../Button';
import Paper from '@material-ui/core/Paper';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import NeoCoinIcon from '../../../public/neocoin.svg';
import ProductDescriptionModal from './ProductDescriptionModal';
import { products } from './products';

const useStyles = makeStyles(theme => ({
  root: {
    width: '155px',
    background: 'white',
    textAlign: 'center',
    padding: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productTitle: {
    margin: '0',
    fontWeight: 'lighter',
    fontStyle: 'italic',
    padding: '5px',
    height: '50px',
    fontSize: '12px',
  },
  selectButton: { fontWeight: 'bolder' },
  coins: {
    margin: '0',
    fontWeight: 'bold',
    fontSize: '22px',
    display: 'flex',
    justifyContent: 'center',
  },
  productIcon: {
    width: '50px',
  },
  neoCoinIcon: {
    width: '25px',
    marginRight: '5px',
  },
  productCard: {
    marginRight: '20px',
    padding: '5px',
    marginBottom: '20px',
  },
  productButton: {
    margin: '0',
  },
}));
function ProductCard({
  priceInCoins = 5000,
  title,
  Icon,
  productId,
  description,
  user,
  refetch,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const isthere =
    user && user.myCollection && user.myCollection.map(v => v.id === productId);
  const isPlantATree = productId === '2';

  return (
    <>
      <Paper elevation={3} className={classes.productCard}>
        <div className={classes.root}>
          <img src={Icon} className={classes.productIcon} />
          <p className={classes.coins}>
            <NeoCoinIcon className={classes.neoCoinIcon} />
            <NumberFormat
              value={priceInCoins}
              displayType={'text'}
              thousandSeparator={true}
            />
          </p>
          <p className={classes.productTitle}>{title}</p>
          <Button
            size="small"
            onClick={() => setOpen(true)}
            fullWidth
            className={classes.productButton}
            //disabled={hasPurchased}
          >
            <span className={classes.selectButton}>{'Select'}</span>
          </Button>
        </div>
        <ProductDescriptionModal
          user={user}
          isPlantATree={isPlantATree}
          priceInCoins={priceInCoins}
          productId={productId}
          refetch={refetch}
          open={open}
          handleClose={handleClose}
          title={title}
          Icon={Icon}
          description={description}
        />
      </Paper>
    </>
  );
}

export default ProductCard;
