import React, { ReactNode } from "react";

interface LayersProps {
    children: ReactNode;
}

export const Layers: React.FC<LayersProps> = ({ children }) => {
    return <div>{children}</div>;
};
