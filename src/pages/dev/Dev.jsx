import React from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import TypographyKit from '../../kits/typography/TypographyKit';
import ButtonKit from '../../kits/button/ButtonKit';
import TextfieldKit from '../../kits/textfield/TextfieldKit';
import CheckboxKit from '../../kits/checkbox/CheckboxKit';
import DividerKit from '../../kits/divider/DividerKit';
import FormGroupKit from '../../kits/formGroup/FormGroupKit';
import FormControlLabelKit from '../../kits/formControlLabel/FormControlLabel';

const Dev = () => (
  <div style={{ position: 'relative', height: '90vh', display: 'flex' }}>
    <TypographyKit style={{ position: 'absolute', top: '40px', right: '40px', fontWeight: 'bold' }}>
      Don&apos;t have an account ?{' '}
      <Link style={{ color: '#00AB55', textDecoration: 'none' }} to="/signup">
        Get started
      </Link>
    </TypographyKit>
    <div style={{ margin: 'auto', minWidth: '340px', maxWidth: '520px' }}>
      <div style={{ marginBottom: '1.6rem' }}>
        <TypographyKit
          variant="h5"
          style={{ textAlign: 'start', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Sign in to Revly
        </TypographyKit>
        <TypographyKit variant="body2" color="#637381" style={{ textAlign: 'start' }}>
          Enter your details below
        </TypographyKit>
      </div>
      <div>
        <ButtonKit variant="outlined" size="medium" fullWidth style={{ marginBottom: '0.8rem' }}>
          <FcGoogle style={{ fontSize: '24px' }} />
        </ButtonKit>
      </div>
      <DividerKit style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
        <TypographyKit variant="body2" color="#637381">
          OR
        </TypographyKit>
      </DividerKit>
      <div style={{ marginBottom: '0.8rem' }}>
        <TextfieldKit label="Email address" size="small" fullWidth />
      </div>
      <div style={{ marginBottom: '0.8rem' }}>
        <TextfieldKit type="password" label="Password" size="small" fullWidth />
      </div>
      <div
        style={{
          marginBottom: '0.8rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FormGroupKit>
          <FormControlLabelKit
            control={<CheckboxKit defaultChecked />}
            label={<TypographyKit variant="body2">Remember me</TypographyKit>}
          />
        </FormGroupKit>
        <Link
          style={{
            color: '#826AF9',
            textDecoration: 'none',
            fontSize: '12.25px',
            alignSelf: 'center',
          }}
          to="/forgot-password"
        >
          Forgot Password ?
        </Link>
      </div>
      <div>
        <ButtonKit fullWidth variant="contained">
          Login
        </ButtonKit>
      </div>
    </div>
  </div>
);

export default Dev;
