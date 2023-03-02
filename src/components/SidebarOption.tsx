import { ISidebarOptions, OverlayState } from "../constants";
import React from "react";
import styled from "styled-components";
import { Icon, Stack } from "@mui/material";

const CustomSidebarIcon = styled(Stack)<{ isActive: boolean }>`
	${({ isActive }) =>
		isActive &&
		`	
			.icon-container {
				background-color: #336E8F;
			}
			p.icon-label {
				color: #336E8F;
			}
			svg {
				fill: #96cbe8 !important;
			}
		`};
	cursor: pointer;

	.icon-container {
		width: 50px;
		height: 100%;
		display: flex;
		justify-content: center;
		border-radius: 12px;
		transition: all 0.3s ease-in-out;
		padding: 5px 7px;

		&:hover {
			background-color: ${({ isActive }) =>
				isActive ? "#336E8F" : "#40494f"};
		}
	}
	p.icon-label {
		margin: 0;
	}
`;

export const SidebarOption = ({
	option,
	onSelect,
	isActive,
}: {
	option: ISidebarOptions;
	onSelect: (val: OverlayState) => void;
	isActive: boolean;
}): JSX.Element => (
	<CustomSidebarIcon
		isActive={isActive}
		direction="column"
		alignItems="center"
		justifyContent="center"
		onClick={() => onSelect(option.overlayState)}
	>
		<div className="icon-container">
			<Icon component={option.icon} />
		</div>
		<p className="icon-label">{option.label}</p>
	</CustomSidebarIcon>
);
