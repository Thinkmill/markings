/** @jsx jsx */

import { jsx } from "@emotion/react";

type IconProps = {
  fill?: string;
  size?: number;
};

const Icon = ({ fill = "currentColor", size = 16, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      css={{ fill }}
      focusable="false"
      height={size}
      role="img"
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  );
};

// Exports
// ------------------------------

/*
  Paths borrowed from https://blueprintjs.com/docs/#icons
*/

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path
      d="M11.77 1.16c-.81.81-.74 2.28.02 3.76L6.1 8.71c-2.17-1.46-4.12-2-4.94-1.18l4.95 4.95-4.95 6.36 6.36-4.95 4.95 4.95c.82-.82.27-2.77-1.19-4.94l3.8-5.69c1.47.76 2.94.84 3.76.02l-7.07-7.07z"
      fillRule="evenodd"
    />
  </Icon>
);
export const AddIcon = (props: IconProps) => (
  <Icon {...props}>
    <path
      d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm5-9h-4V5c0-.55-.45-1-1-1s-1 .45-1 1v4H5c-.55 0-1 .45-1 1s.45 1 1 1h4v4c0 .55.45 1 1 1s1-.45 1-1v-4h4c.55 0 1-.45 1-1s-.45-1-1-1z"
      fillRule="evenodd"
    />
  </Icon>
);
export const CrossIcon = (props: IconProps) => (
  <Icon {...props}>
    <path
      d="M11.41 10l4.29-4.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L10 8.59l-4.29-4.3a1.003 1.003 0 00-1.42 1.42L8.59 10 4.3 14.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71l4.29-4.3 4.29 4.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L11.41 10z"
      fillRule="evenodd"
    />
  </Icon>
);
