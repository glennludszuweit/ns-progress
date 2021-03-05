import React from 'react';
import ProductCard from './ProductCard';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import { getCurrentUser } from '../../apollo/utils/userDataUtils';
import { products } from './products';

const useStyles = makeStyles(theme => ({
  root: {},
}));

function Shop() {
  const classes = useStyles();
  const { user, refetch } = getCurrentUser();

  return (
    <Grid container>
      {products.map((v, i) => (
        <ProductCard
          priceInCoins={v.priceInCoins}
          title={v.title}
          Icon={v.productIcon}
          description={v.description}
          user={user}
          productId={v.productId}
          refetch={refetch}
        />
      ))}
    </Grid>
  );
}

export default Shop;

