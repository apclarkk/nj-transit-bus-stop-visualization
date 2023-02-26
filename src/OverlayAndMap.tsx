import React from "react";
import styled from "styled-components";
import { BoundType } from "./constants";
import { Map } from "./Map";
import { Box } from "@mui/material";
import StopsLogo from "./assets/images/stops_logo_boxed.png";

const Wrapper = styled.div``;

const OverlayWrapper = styled(Box)`
	position: absolute;
	width: 100%;
	height: 100%;
	border: 1px solid red;
	background: linear-gradient(
		90deg,
		#003c5e 45.83%,
		rgba(0, 60, 94, 0.73) 77.08%,
		rgba(0, 60, 94, 0.37) 100%
	);
	.visually-hidden {
		display: none;
		appearance: none;
	}
	z-index: 9999;
`;

interface IDisplayOptions {
	boundType?: BoundType;
}

export const OverlayAndMap = (): JSX.Element => {
	const [displayOptions, setDisplayOptions] = React.useState<IDisplayOptions>(
		{}
	);

	return (
		<Wrapper>
			<Overlay />
			<Map />
		</Wrapper>
	);
};

const Overlay = (): JSX.Element => {
	return (
		<OverlayWrapper>
			<h1 className="visually-hidden">Welcome to Stops</h1>
			<h2>Welcome to</h2>
			<img src={StopsLogo} alt="Stops Logo" />
		</OverlayWrapper>
	);
};
