import { useCallback, useEffect, useState } from "react";
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
import styled from "styled-components";
import { HelpCenterRounded, TuneOutlined } from "@mui/icons-material";
import StopsLogoSM from "../assets/images/stops_logo_sm.png";
import { SidebarOption } from "./SidebarOption";
import StopsLogo from "../assets/images/stops_logo_boxed.png";

const SidebarWrapper = styled(Stack)`
	display: flex;
	height: 100%;
	width: 3.7rem;
	justify-content: center;
	background: #283239;
	position: absolute;
	left: 0;
	width: 74px;
	z-index: 1001;
	padding: "10px 10px 0px 10px";
	#stops-logo {
		max-width: 42px;
	}
`;

export const Sidebar = ({
	stopsData,
	setOverlayState,
	overlayState,
	setDisplayOptions,
	displayOptions,
	...props
}: ISidebarProps): JSX.Element => {
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [showFilteringMenu, setShowFilteringMenu] = useState(false);
	const stopsLen = stopsData.length;

	useEffect(() => {
		if (
			overlayState.overlayState !== OverlayState.HOME &&
			overlayState.overlayState !== OverlayState.TABLE &&
			overlayState.overlayState !== OverlayState.ABOUT
		) {
			setShowSearchBar(true);
		} else {
			setShowSearchBar(false);
		}
		if (showFilteringMenu && !showSearchBar) setShowFilteringMenu(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [overlayState]);

	const onSelect = useCallback(
		(val: OverlayState) => {
			if (
				val === OverlayState.MAP_FREE_ROAM &&
				overlayState.overlayState !== OverlayState.MAP_SEARCHED &&
				displayOptions.markerLimit === stopsLen &&
				!window.confirm(
					`Warning\nYou are about to render ${stopsLen.toLocaleString()} pins on the map. Click on the face in the top left to find the filters to set a max pin limit \nOR\n Select a municipality to render pins for that municipality only`
				)
			) {
				return;
			} else {
				setOverlayState({ overlayState: val });
			}
		},
		[
			displayOptions.markerLimit,
			overlayState.overlayState,
			setOverlayState,
			stopsLen,
		]
	);
	return (
		<SidebarWrapper direction="column">
			<Stack
				className="search-bar-positioning-wrapper"
				sx={{
					position: "absolute",
					left: "4.55rem",
					top: "15px",
				}}
			>
				<Collapse in={showSearchBar} orientation="horizontal">
					<SearchBar
						stopsData={stopsData}
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
							onSelect={onSelect}
							isActive={
								overlayState.overlayState ===
								option.overlayState
							}
						/>
					))}
				</Stack>
			</Stack>
			<Stack mt={"auto"} pb="10px">
				<SidebarOption
					option={{
						icon: HelpCenterRounded,
						label: "",
						overlayState: OverlayState.ABOUT,
					}}
					isActive={overlayState.overlayState === OverlayState.ABOUT}
					onSelect={onSelect}
				/>
			</Stack>
			<Stack
				className="about-section-positioning-wrapper"
				sx={{
					position: "absolute",
					left: "5.75rem",
					bottom: "3px",
				}}
			>
				<Collapse
					in={overlayState.overlayState === OverlayState.ABOUT}
					orientation="vertical"
				>
					<StyledPopOutMenu>
						<p>
							<a
								href="https://github.com/clarkandrew10/nj-transit-bus-stop-visualization"
								rel="noreferrer"
								target="_blank"
							>
								<img
									src={StopsLogo}
									width="35px"
									alt="Stops logo Boxed"
								/>
							</a>{" "}
							was created during{" "}
							<a
								href="https://hackru.org"
								rel="noreferrer"
								target="_blank"
							>
								HACKRU Spring 2023
							</a>{" "}
							by{" "}
							<a
								href="https://apclark.org"
								rel="noreferrer"
								target="_blank"
							>
								Andrew Clark
							</a>{" "}
							with asset design help from{" "}
							<a
								href="https://www.linkedin.com/in/spalpe/"
								rel="noreferrer"
								target="_blank"
							>
								Max Gonzalez
							</a>
							. The purpose of this tool is to help NJ Transit
							route planners with improving and optimizing
							pre-existing and future bus routes. Default marker
							radii reflects the acceptable walk-shed for riders
							(1/4 mile or 400m) - with them enabled, the
							marker&apos;s radii can be used to observe overlap
							between stops or dead zones with no coverage within
							certain municipalities. The potential removal of
							&apos;redundant&apos; bus stops could result in
							redirected spending towards improving infrastructure
							(bus shelters, newer buses, etc...), increase route
							speed (less stopping), lower bus emissions (less
							start-stop), and overall increase in rider
							satisfaction.{" "}
						</p>
						<p>🏆 Winner of Best Solo Hack</p>
						<p>
							Inspiration for this project came from{" "}
							<a
								href="https://streets.mn/2014/09/11/the-case-for-quarter-mile-bus-stop-spacing/"
								target="_blank"
								rel="noreferrer"
							>
								<em>
									The Case For Quarter Mile Bus Stop Spacing
								</em>
							</a>{" "}
							by{" "}
							<a
								href="https://streets.mn/author/acecchini/"
								target="_blank"
								rel="noreferrer"
							>
								<b>Alex Cecchini</b>
							</a>
						</p>
					</StyledPopOutMenu>
				</Collapse>
			</Stack>
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
	min-width: 418px;
	p {
		margin-top: 0;
	}
	a {
		color: #8cc6e6;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
		&:hover {
			color: #668fa6;
		}
	}
`;

const FilteringMenu = ({
	setDisplayOptions,
	displayOptions,
}: {
	displayOptions: IDisplayOptions;
	setDisplayOptions: React.Dispatch<React.SetStateAction<IDisplayOptions>>;
}): JSX.Element => {
	return (
		<StyledPopOutMenu
			width={"225px"}
			direction="row"
			justifyContent="space-between"
		>
			<Stack>
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
			</Stack>
			<TextField
				label="Marker limit"
				type="number"
				inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
				onChange={(e) => {
					if (Number(e.target.value) >= 0) {
						setDisplayOptions((prev) => ({
							...prev,
							markerLimit: Number(e.target.value),
						}));
					}
				}}
				value={displayOptions.markerLimit}
			/>
		</StyledPopOutMenu>
	);
};
