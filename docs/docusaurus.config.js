// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: "DataLinks",
	tagline: "Stay organized with crowdsourcing",
	url: "https://datasektionen.link",
	baseUrl: "/",
	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",
	favicon: "img/favicon.ico",
	organizationName: "hampfh", // Usually your GitHub org/user name.
	projectName: "DataLinks", // Usually your repo name.

	presets: [
		[
		"@docusaurus/preset-classic",
		/** @type {import('@docusaurus/preset-classic').Options} */
		({
			docs: {
				sidebarPath: require.resolve("./sidebars.js"),
				// Please change this to your repo.
				editUrl: "https://github.com/hampfh/datalinks",
			},
			blog: {
				showReadingTime: false,
				// Please change this to your repo.
				editUrl: "https://github.com/hampfh/datalinks",
			},
			theme: {
				customCss: require.resolve("./src/css/custom.css"),
			},
		}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
		navbar: {
			title: "Datalinks",
			logo: {
				alt: "DataLinks logo",
				src: "img/logo.png",
			},
			items: [
				{
					type: "doc",
					docId: "intro",
					position: "left",
					label: "Documentation",
				},
				{
					type: 'docsVersionDropdown',
				},
				{
					href: "https://github.com/hampfh/datalinks",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
			{
				title: "Docs",
				items: [
				{
					label: "Tutorial",
					to: "/docs/intro",
				},
				],
			},
			{
				title: "Community",
				items: [
					{
						label: "DataLinks",
						href: "https://datasektionen.link",
					}
				],
			},
			{
				title: "More",
				items: [
					{
						label: "GitHub",
						href: "https://github.com/hampfh/datalinks",
					},
				],
			},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Datalinks, Inc. Built with Docusaurus.`,
		},
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
		},
    }),
};

module.exports = config;
