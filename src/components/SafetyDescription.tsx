import React from 'react';

interface SafetyDescriptionProps {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const SafetyDescription: React.FC<SafetyDescriptionProps> = ({ description, setDescription }) => {
  return (
    <section id="description-field" className="mb-4">
      <h2>Description</h2>
      <textarea
        id="description"
        rows={5}
        className="form-control"
        placeholder="Describe the safety issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </section>
  );
};

export default SafetyDescription;

