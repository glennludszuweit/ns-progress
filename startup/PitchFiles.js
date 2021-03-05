import { useMutation } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import Button from '../Button';
import {
  updatePitchQuery,
  uploadFile,
} from '../../apollo/utils/generalQueries';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Link from '@material-ui/core/Link';

export default (props) => {
  if (props.startup.hasEditPermissions) return writeable(props);
  else return readable(props);
};

const readable = ({ pitch }) => {
  const files = pitch.files;
  return (
    <>
      <Divider />
      <Typography variant="h3">Files and documents</Typography>
      {files &&
        files.length > 0 &&
        files.map((file, index) => (
          <Grid key={index} item xs={12} sm={8}>
            <Link href={file.url} download>
              {file.name}
            </Link>
          </Grid>
        ))}
      {(!files || files.length < 1) && (
        <Typography variant="body1">Currently no files.</Typography>
      )}
    </>
  );
};

const writeable = ({ startup, pitch }) => {
  const [updatePitch, { loading: pitchLoading }] = useMutation(
    updatePitchQuery
  );
  const [startFileUpload, { loading: uploadLoading }] = useMutation(uploadFile);
  const [files, setFiles] = useState(
    pitch.files
      ? pitch.files.map((f) => {
          delete f.__typename;
          return f;
        })
      : []
  );
  const [buttonLabel, setButtonLabel] = useState('Upload file');

  function updateFiles(newFiles) {
    setFiles(newFiles);
    updatePitch({
      variables: {
        _id: startup._id,
        pitch: { files: newFiles },
      },
    });
  }

  const inputId = `input-files`;
  return (
    <>
      <Divider />
      <Typography variant="h3">Files</Typography>{' '}
      {files.map((file, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={12}
          container
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Link href={file.url} download>
              {file.name}
            </Link>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() =>
                updateFiles(files.filter((f) => f.url !== file.url))
              }
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12} sm={12}>
        <Button
          loading={pitchLoading || uploadLoading}
          size="small"
          onClick={() => document.getElementById(inputId).click()}
        >
          {buttonLabel}
        </Button>
        <input
          id={inputId}
          hidden
          type="file"
          onChange={async (a) => {
            const file = a.target.files[0];
            if (file.size > 3145728) {
              setButtonLabel('File is larger than 3mb');
              return;
            } else setButtonLabel('Upload file');
            const uploadResponse = await startFileUpload({
              variables: { file },
            });
            updateFiles([
              ...files,
              {
                name: file.name,
                url: uploadResponse.data.uploadFile,
              },
            ]);
          }}
        />
      </Grid>
    </>
  );
};
