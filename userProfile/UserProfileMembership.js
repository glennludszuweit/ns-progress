import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '../Button';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import getConfig from 'next/config';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import getActivePlan from '../../utils/getActivePlan';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import plans from '../../../common/plans';
import CheckIcon from '@material-ui/icons/Check';
import DownloadIcon from '../../../media/icons/download.svg';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import DialogActions from '@material-ui/core/DialogActions';

const { publicRuntimeConfig } = getConfig();

const stripePromise = loadStripe(publicRuntimeConfig.stripePublicKey, {
  locale: 'en',
});

export default ({ user, refetchUser }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePayment user={user} refetchUser={refetchUser} />
    </Elements>
  );
};

const CHANGE_PLAN = gql`
  mutation changePlan($planId: Int!) {
    changePlan(planId: $planId) {
      success
      clientSecret
      paymentMethodId
    }
  }
`;

const CHANGE_PAYMENT_METHOD = gql`
  mutation changePaymentMethod($paymentMethodId: String!) {
    changePaymentMethod(paymentMethodId: $paymentMethodId) {
      success
      clientSecret
      paymentMethodId
    }
  }
`;

const REFETCH_PAYMENT_METHOD_STATE = gql`
  mutation refetchPaymentMethodState {
    refetchPaymentMethodState
  }
`;

const useStyles = makeStyles(({ palette, fontSizeList }) => ({
  card: {
    height: '100%',
  },
  planActive: {
    height: '100%',
    borderColor: palette.primary.main,
  },
  listItem: {
    padding: 0,
  },
  listItemText: {
    fontSize: fontSizeList.variant2,
    fontWeight: 400,
  },
  listItemIcon: {
    minWidth: '20px',
  },
  checkIcon: {
    height: '10px',
    width: '10px',
  },
  dialog: {
    minWidth: '400px',
  },
  dialogContent: {
    margin: '20px 0',
    paddingBottom: '5px',
    borderBottom: `1px solid #919191`,
  },
  downloadIcon: {
    height: '30px',
    width: '30px',
  },
  text: {
    fontSize: '10px',
    color: '#9E9E9E',
    paddingLeft: '10px',
  },
}));

const StripePayment = ({ user, refetchUser }) => {
  if (!user.stripe) return null;

  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();
  const [errorSnack, setErrorSnack] = React.useState(undefined);
  const [paymentCheckout, setPaymentCheckout] = React.useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [
    cardInputElementCompleted,
    setCardInputElementCompleted,
  ] = React.useState(false);
  const [changePlan] = useMutation(CHANGE_PLAN);
  const [changePaymentMethod] = useMutation(CHANGE_PAYMENT_METHOD);
  const [refetchPaymentMethodState] = useMutation(REFETCH_PAYMENT_METHOD_STATE);

  const savePayment = async () => {
    if (!stripe || !elements) return showError('Internal error. A1');
    setPaymentLoading(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) return 'Internal error. A2';

    try {
      const { data } = await changePaymentMethod({
        variables: {
          paymentMethodId: paymentMethod.id,
        },
      });
      const {
        clientSecret,
        success,
        paymentMethodId,
      } = data.changePaymentMethod;
      if (!success)
        return showError('The payment method could not be changed.');
      else if (clientSecret) {
        await stripe.confirmCardSetup(clientSecret, {
          payment_method: paymentMethodId,
        });
        await refetchPaymentMethodState();
      }
    } catch (e) {
      console.log('a', e);
      return showError('Internal error. A3');
    }

    if (paymentCheckout) await savePlan(paymentCheckout, false);
    setPaymentDialogOpen(false);
    refetchUser();
  };

  const savePlan = async (planId, refetch = true) => {
    try {
      const { data } = await changePlan({
        variables: {
          planId,
        },
      });
      const { clientSecret, success, paymentMethodId } = data.changePlan;
      if (!success) return showError('The membership could not be changed.');
      else if (clientSecret)
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodId,
        });
    } catch (e) {
      console.log('b', e);
      return showError('Internal error. A4');
    }

    if (refetch) refetchUser();
    setTimeout(() => {
      refetchUser();
    }, 3000);
  };

  const showError = error => {
    console.log('show error', error);
    setPaymentDialogOpen(false);
    setErrorSnack(error);
  };

  const isEmailVerified = user.email.isVerified;
  const activePlan = getActivePlan(user);

  return (
    <>
      <Typography variant="h3">Membership</Typography>
      <Typography variant="body2">
        Your Membership will help us to build a startup ecosystem for all of us.
        Let’s collaborate, create and innovate for a better future.
      </Typography>
      <br></br>
      <Grid item xs={12} sm={12}>
        <Grid container direction="row" spacing={2}>
          {plans.map((plan, index) => {
            const isActivePlan = plan === activePlan;
            const isPendingPayment =
              plan.stripeId &&
              user.stripe.subscription &&
              user.stripe.subscription.planId === plan.stripeId &&
              !user.stripe.subscription.active;
            const isPayedPlan =
              plan.stripeId &&
              user.stripe.subscription &&
              user.stripe.subscription.planId === plan.stripeId &&
              user.stripe.subscription.active;
            const isCanceldPlan =
              plan.stripeId &&
              user.stripe.subscription &&
              user.stripe.subscription.planId === plan.stripeId &&
              user.stripe.subscription.canceld;

            const planCard = (
              <Card
                variant="outlined"
                className={isActivePlan ? classes.planActive : classes.card}
              >
                <CardContent>
                  <Typography variant="h3">{plan.name}</Typography>
                  <List dense={true}>
                    {plan.features.map((feature, fIndex) => (
                      <ListItem
                        key={fIndex}
                        classes={{ root: classes.listItem }}
                      >
                        <ListItemIcon classes={{ root: classes.listItemIcon }}>
                          <CheckIcon className={classes.checkIcon} />
                        </ListItemIcon>
                        <ListItemText
                          classes={{ primary: classes.listItemText }}
                          primary={feature}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {plan.price && (
                    <Box py={1}>
                      <Typography variant="body2">{plan.price}</Typography>
                    </Box>
                  )}
                  {isCanceldPlan && (
                    <Box py={1}>
                      <Typography variant="body2">
                        <b>Cancelled.</b>
                      </Typography>
                    </Box>
                  )}
                  {isPendingPayment && (
                    <Box py={1}>
                      <Typography variant="body2">
                        <b>Waiting for payment.</b>
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                {!isPendingPayment && (
                  <>
                    {plan.price && !isActivePlan && (
                      <CardActions>
                        <Button
                          size="small"
                          disabled={!isEmailVerified}
                          onClick={() => {
                            setPaymentCheckout(index);
                            setPaymentLoading(false);
                            setCardInputElementCompleted(false);
                            setPaymentDialogOpen(true);
                          }}
                        >
                          Upgrade
                        </Button>
                      </CardActions>
                    )}
                    {!isCanceldPlan && isActivePlan && (
                      <CardActions>
                        <Button size="small" onClick={() => savePlan(0)}>
                          Cancel
                        </Button>
                      </CardActions>
                    )}
                    {isCanceldPlan && (
                      <CardActions>
                        <Button size="small" onClick={() => savePlan(index)}>
                          Continue
                        </Button>
                      </CardActions>
                    )}
                  </>
                )}
              </Card>
            );

            return (
              <Grid item xs={6} key={index}>
                {plan.price && !isEmailVerified ? (
                  <Tooltip
                    placement="bottom"
                    title={
                      !isEmailVerified
                        ? 'Please verify your email first.'
                        : undefined
                    }
                  >
                    {planCard}
                  </Tooltip>
                ) : (
                  planCard
                )}
              </Grid>
            );
          })}

          <Typography className={classes.text}>
            By clicking Upgrade your payment method will be charged a recurring
            monthly fee, unless you decide to cancel. No refunds for memberships
            cancelled or downgraded between billing cycles. All price excl.
            VAT/GST.
          </Typography>
        </Grid>
        <br></br>

        {user.stripe.paymentMethod && user.stripe.paymentMethod.id && (
          <Box py={2}>
            <Typography variant="h3">Payment method</Typography>
            <Typography variant="body1">
              {user.stripe.paymentMethod.brand.toUpperCase()} ****{' '}
              {user.stripe.paymentMethod.last4}
            </Typography>

            <Box py={1}>
              <Button
                size="small"
                onClick={() => {
                  setPaymentCheckout(null);
                  setPaymentLoading(false);
                  setCardInputElementCompleted(false);
                  setPaymentDialogOpen(true);
                }}
              >
                Change
              </Button>
            </Box>
          </Box>
        )}
        <Box py={2}>
          <Typography variant="h3">Invoices</Typography>
          {user.invoices.length < 1 && (
            <Typography variant="body2">Currently no one.</Typography>
          )}
          {user.invoices.map((invoice, index) => (
            <Grid
              key={index}
              container
              spacing={2}
              alignItems="center"
              justify="space-between"
              direction="row"
            >
              <Grid item>
                <Typography variant="body1">{invoice.date}</Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Download">
                  <IconButton
                    onClick={() => {
                      const win = window.open(invoice.url, '_blank');
                      win.focus();
                    }}
                  >
                    <DownloadIcon className={classes.downloadIcon} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Grid>
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      >
        <DialogTitle disableTypography={true}>
          <Typography variant="h3">Payment method</Typography>
        </DialogTitle>
        <DialogContent className={classes.dialog}>
          <div className={classes.dialogContent}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    fontWeight: 400,
                    fontFamily: '"Open Sans", sans-serif',
                    color: '#000000',
                    '::placeholder': {
                      color: '#000000',
                    },
                  },
                  invalid: {
                    color: '#F4364C',
                  },
                },
              }}
              onChange={element => {
                if (element.complete && !cardInputElementCompleted)
                  setCardInputElementCompleted(true);
                else if (!element.complete && cardInputElementCompleted)
                  setCardInputElementCompleted(false);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            disabled={!stripe || !cardInputElementCompleted}
            loading={paymentLoading}
            onClick={savePayment}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={errorSnack}
        autoHideDuration={6000}
        onClose={() => setErrorSnack(undefined)}
      >
        <Alert onClose={() => setErrorSnack(undefined)} severity="success">
          {errorSnack}
        </Alert>
      </Snackbar>
    </>
  );
};
