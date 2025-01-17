import React from 'react';

interface SignOffCheckboxProps {
  isSignedOff: boolean;
  setIsSignedOff: (value: boolean) => void;
}

const SignOffCheckbox: React.FC<SignOffCheckboxProps> = ({ isSignedOff, setIsSignedOff }) => {
  return (
    <section id="sign-off" className="mb-4">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="signOffCheckbox"
          checked={isSignedOff}
          onChange={(e) => setIsSignedOff(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="signOffCheckbox">
          I have reviewed and confirm the report is accurate.
        </label>
      </div>
    </section>
  );
};

export default SignOffCheckbox;

