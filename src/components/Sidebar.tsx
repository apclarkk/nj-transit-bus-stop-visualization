import { useEffect, useState } from "react";
import {
	IDisplayOptions,
	ISidebarProps,
	MarkerStyleOptions,
	OverlayState,
	RadiusStyleOptions,
	SidebarOptions,
} from "../constants";
import {
	Stack,
	Collapse,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Fade,
	TextField,
	Button,
	Icon,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import { useMap } from "react-leaflet";
import styled from "styled-components";
import { HelpCenterRounded, TuneOutlined } from "@mui/icons-material";
import StopsLogoSM from "../assets/images/stops_logo_sm.png";
import { SidebarOption } from "./SidebarOption";

const SidebarWrapper = styled(Stack)`
	display: flex;
	height: 100%;
	width: 3.7rem;
	justify-content: center;
	background: #283239;
	position: absolute;
	left: 0;
	z-index: 1001;
	padding: 10px;
	padding-bottom: 40px;
	#stops-logo {
		max-width: 42px;
	}
`;

export const Sidebar = ({
	setOverlayState,
	overlayState,
	setDisplayOptions,
	displayOptions,
	...props
}: ISidebarProps): JSX.Element => {
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [showFilteringMenu, setShowFilteringMenu] = useState(false);

	useEffect(() => {
		if (
			overlayState.overlayState !== OverlayState.HOME &&
			overlayState.overlayState !== OverlayState.TABLE
		) {
			setShowSearchBar(true);
		} else {
			setShowSearchBar(false);
		}
		if (showFilteringMenu && !showSearchBar) setShowFilteringMenu(false);
	}, [overlayState]);

	return (
		<SidebarWrapper direction="column" justifyContent="space-between">
			<Stack
				className="search-bar-positioning-wrapper"
				sx={{
					position: "absolute",
					left: "4.75rem",
					top: "15px",
				}}
			>
				<Collapse in={showSearchBar} orientation="horizontal">
					<SearchBar
						setOverlayState={setOverlayState}
						overlayState={overlayState}
						setShowFilteringMenu={setShowFilteringMenu}
						// these two aren't needed, I'm just too lazy to create a new interface...
						setDisplayOptions={setDisplayOptions}
						displayOptions={displayOptions}
						{...props}
					/>
				</Collapse>
			</Stack>
			<Stack
				className="filtering-menu-positioning-wrapper"
				sx={{
					position: "absolute",
					left: "5.75rem",
					top: "110px",
				}}
			>
				<Collapse in={showFilteringMenu} orientation="vertical">
					<FilteringMenu
						setDisplayOptions={setDisplayOptions}
						displayOptions={displayOptions}
					/>
				</Collapse>
			</Stack>
			<Stack
				direction="column"
				alignItems="center"
				sx={{
					marginTop: "20px",
					"#stops-logo": {
						transform: `rotate(${
							showSearchBar ? "90deg" : "0deg"
						})`,
						transition: "transform 0.2s ease-in-out",
					},
				}}
			>
				<img
					src={StopsLogoSM}
					alt="Stops Logo"
					id="stops-logo"
					onClick={() => {
						setShowSearchBar((prev) => {
							if (prev) setShowFilteringMenu(false);
							return !prev;
						});
					}}
					style={{ cursor: "pointer" }}
				/>
				<Stack direction="column" spacing="10px" mt="20px">
					{SidebarOptions.map((option) => (
						<SidebarOption
							key={option.label}
							option={option}
							setOverlayState={setOverlayState}
							isActive={
								overlayState.overlayState ===
								option.overlayState
							}
						/>
					))}
				</Stack>
			</Stack>
			<SidebarOption
				option={{
					icon: HelpCenterRounded,
					label: "",
					overlayState: OverlayState.ABOUT,
				}}
				isActive={overlayState.overlayState === OverlayState.ABOUT}
				setOverlayState={setOverlayState}
			/>
		</SidebarWrapper>
	);
};

const StyledSearchBar = styled(Stack)`
	display: flex;
	flex-direction: row;
	width: 100%;
	min-width: 650px;
	background-color: #283239;
	border-radius: 0 69px 69px 0;
	padding: 10px 15px;

	.search-wrapper,
	.select-wrapper {
		width: 250px;
	}

	p {
		font-size: 1.25rem;
		white-space: nowrap;
		margin: 0;
	}
`;

const SearchBar = ({
	displayOptions,
	municipalityData,
	onGoClick,
	onSearchChange,
	onSelectChange,
	searchText,
	setShowFilteringMenu,
}: ISidebarProps): JSX.Element => (
	<StyledSearchBar>
		<Stack direction="column" spacing="10px">
			<Stack
				className="lower"
				direction="row"
				spacing="20px"
				alignItems="center"
			>
				<FormControl className="select-wrapper">
					<InputLabel id="municipality-select-label">
						Select
					</InputLabel>
					<Select
						labelId="municipality-select-label"
						id="municipality-select-label"
						value={displayOptions.municipalityInfo?.name ?? ""}
						label="Municipality"
						onChange={onSelectChange}
					>
						<MenuItem value="">None</MenuItem>
						{municipalityData.map((municipality) => (
							<MenuItem
								key={municipality.geonamesId}
								value={municipality.name}
							>
								{municipality.name} / {municipality.county}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<p style={{ marginLeft: "20px" }}>or</p>
				<TextField
					placeholder="Search"
					className="search-wrapper"
					value={searchText}
					onChange={onSearchChange}
				/>

				<Fade
					in={!!displayOptions.municipalityInfo?.name || !!searchText}
				>
					<Button
						variant="outlined"
						className="go-btn"
						onClick={onGoClick}
					>
						Go
					</Button>
				</Fade>
				{!!setShowFilteringMenu ? (
					<Icon
						component={TuneOutlined}
						onClick={() => setShowFilteringMenu((prev) => !prev)}
					/>
				) : null}
			</Stack>
		</Stack>
	</StyledSearchBar>
);

const StyledPopOutMenu = styled(Stack)`
	padding: 20px;
	background-color: #283239;
	border-radius: 22px;
`;

const FilteringMenu = ({
	displayOptions,
	setDisplayOptions,
}: {
	displayOptions: IDisplayOptions;
	setDisplayOptions: React.Dispatch<React.SetStateAction<IDisplayOptions>>;
}): JSX.Element => {
	return (
		<StyledPopOutMenu width={"225px"}>
			<FormControl>
				<FormLabel id="radius-style-label">Radius style</FormLabel>
				<RadioGroup
					aria-labelledby="radius-style-label"
					defaultValue="diamond"
					name="radio-buttons-group"
				>
					{RadiusStyleOptions.map((option) => (
						<FormControlLabel
							value={option.boundType}
							control={<Radio />}
							label={option.label}
							onClick={() =>
								setDisplayOptions((prev) => ({
									...prev,
									boundType: option.boundType,
								}))
							}
						/>
					))}
				</RadioGroup>
			</FormControl>
			<FormControl sx={{ marginTop: "10px" }}>
				<FormLabel id="marker-style-label">Marker style</FormLabel>
				<RadioGroup
					aria-labelledby="marker-style-label"
					defaultValue="marker"
					name="radio-buttons-group"
				>
					{MarkerStyleOptions.map((option) => (
						<FormControlLabel
							value={option.markerType}
							control={<Radio />}
							label={option.label}
							onClick={() =>
								setDisplayOptions((prev) => ({
									...prev,
									markerType: option.markerType,
								}))
							}
						/>
					))}
				</RadioGroup>
			</FormControl>
		</StyledPopOutMenu>
	);
};
