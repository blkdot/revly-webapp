import { PhotoCamera } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import AvatarKit from '../../kits/avatar/AvatarKit';
import './AvatarUpload.scss';

const AvatarUpload = (props: any) => {
  const { file, onDrop, onError } = props;

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop,
    onDropRejected: onError,
    maxSize: 3145728,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
  });

  return (
    <div className='image-upload-container'>
      <div {...getRootProps()} className='image-upload'>
        <input {...getInputProps()} />

        {file && (
          <AvatarKit
            className='image-upload__avatar'
            alt='avatar'
            src={typeof file === 'string' ? file : ''}
          >
            N
          </AvatarKit>
        )}

        <div className={`image-upload__placeholder ${file ? '__withfile' : ''}`}>
          <PhotoCamera />
          <p className='image-upload__placeholder__text'>
            {file ? 'Update photo' : 'Upload photo'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
