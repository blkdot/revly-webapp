import { PhotoCamera } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

import './AvatarUpload.scss';

import TypographyKit from '../../kits/typography/TypographyKit';
import AvatarKit from '../../kits/avatar/AvatarKit';

const AvatarUpload = (props) => {
    const { file, onAccept, onError } = props;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        onDropAccepted: (files) => onAccept(files),
        onDropRejected: (err) => onError(err)
    });
    

    return (
        <div {...getRootProps()} className={`image-upload${isDragActive ? '__dragActive' : ''}`}>
          <input {...getInputProps()} />

          {file && <AvatarKit className="image-upload__avatar" alt="avatar" src={typeof file === 'string' ? file : ''}>N</AvatarKit>}

          <div className="image-upload__placehoder">
            <PhotoCamera color='disabled'/>
            <TypographyKit variant="caption">{file ? 'Update photo' : 'Upload photo'}</TypographyKit>
          </div>
        </div>
    );
}

export default AvatarUpload;