import React from "react";
import { ReactComponent as Hidden } from "../svgs/eye-slash-solid.svg";
import { ReactComponent as Visible } from "../svgs/eye-solid.svg";
import { ReactComponent as Remove } from "../svgs/times-solid.svg";
import { ReactComponent as Plus } from "../svgs/plus-solid.svg";
import { ReactComponent as Microphone } from "../svgs/microphone-solid.svg";
import { ReactComponent as Share } from "../svgs/share-alt-solid.svg";

export const HiddenSVG = <Hidden />;
export const VisibleSVG = <Visible />;

interface SVGProps {
  size: number | string;
}

interface HiddenOrVisibleSVGProps extends SVGProps {
  hidden: boolean;
}

export const HiddenOrVisibleSVG = ({
  hidden,
  size,
}: HiddenOrVisibleSVGProps) => {
  if (hidden) {
    return <Hidden width={size} height={size} />;
  }
  return <Visible width={size} height={size} />;
};

export const RemoveSVG = ({ size }: SVGProps) => (
  <Remove width={size} height={size} />
);

export const PlusSVG = ({ size }: SVGProps) => (
  <Plus width={size} height={size} />
);
export const MicrophoneSVG = ({ size }: SVGProps) => (
  <Microphone width={size} height={size} />
);
export const ShareSVG = ({ size }: SVGProps) => (
  <Share width={size} height={size} />
);
