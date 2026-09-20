import React from "react";
import Icon from "../common/Icon";

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused, color, size = 20 }) => {
  return <Icon name={name} size={size} color={color} />;
};

export default TabBarIcon;
