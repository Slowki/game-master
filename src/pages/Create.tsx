import { CampaignManager } from "../cloudstate/campaign";
import Section from "../components/Section";
import HeaderButton from "../components/HeaderButton";

import { useCloud } from "freestyle-sh";
import React from "react";
import { useNavigate } from "react-router-dom";

const Create: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async () => {
    const gmLink =
      await useCloud<typeof CampaignManager>(
        "campaign-manager",
      ).createCampaign();
    navigate(`/player/${gmLink.id}`);
  };

  return (
    <div className="container">
      <Section name="Create a Campaign">
        <p className="muted">
          Create a new campaign and invite your friends. The `Create` button
          will create a new campaign and take you to the GM view. Make sure to
          save the URL so you can get back to your campaign in the future.
        </p>
        <HeaderButton onClick={handleCreate}>Create</HeaderButton>
      </Section>
    </div>
  );
};

export default Create;
