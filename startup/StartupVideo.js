import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Button from '../Button';
import { updateStartupQuery } from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player';
import isValidURI from '../../../common/isValidURI';
import FormikTextField from '../FormikTextField';
import { getCurrentUser } from '../../apollo/utils/userDataUtils';
import Link from '../Link';
import WarningCard from '../WarningCard';

export default ({ startup, refetchStartup }) => {
  const [updateStartup, { data, loading }] = useMutation(updateStartupQuery);
  const { user } = getCurrentUser();

  const formik = useFormik({
    onSubmit: async (values) => {
      await updateStartup({
        variables: {
          _id: startup._id,
          startup: values,
        },
      });
      await refetchStartup();
    },
    validate: (values) => {
      if (values.videoPitchUrl !== '' && !isValidURI(values.videoPitchUrl))
        return { videoPitchUrl: 'no valid uri' };
      return {};
    },
    initialValues: {
      videoPitchUrl: startup.videoPitchUrl ? startup.videoPitchUrl : '',
    },
  });

  const hasSub =
    user &&
    user.stripe &&
    user.stripe.subscription &&
    user.stripe.subscription.active;

  return (
    <>
      <Divider />
      <Typography variant="h3">Video</Typography>
      {startup.videoPitchUrl && startup.videoPitchUrl !== '' && (
        <Grid item xs={12} sm={12}>
          <ReactPlayer url={startup.videoPitchUrl} width="100%" />
        </Grid>
      )}
      {startup.hasEditPermissions && (
        <Grid item xs={12} sm={12}>
          <form onSubmit={formik.handleSubmit}>
            <FormikTextField
              name="videoPitchUrl"
              label="Add image or product video"
              placeholder="Add a video link from YouTube, Vimeo etc."
              props={formik}
              disabled={!hasSub}
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
      )}
    </>
  );
};
