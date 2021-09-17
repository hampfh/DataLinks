import express from "express"
import path from "path"
import fs from "fs"

interface IMetaTag {
	title: string
	description: string
	thumbnail: string
	favicon: string
}

const availableProgramLogos = ["D20", "D21"]

export default class MetaTagPopulator {

	static injectMetaTags = (htmlData: string, meta: IMetaTag): string => {
		// inject meta tags
		htmlData = htmlData.replace(
			"<title>__META_TITLE__</title>",
			`<title>${meta.title}</title>`
		)
			.replace("__META_FAVICON__", meta.favicon)
			.replace("__META_OG_TITLE__", meta.title)
			.replace("__META_DESCRIPTION__", meta.description)
			.replace("__META_OG_DESCRIPTION__", meta.description)
			.replace("__META_OG_IMAGE__", meta.thumbnail)
		return htmlData
	}

	static loadIndexFile = (res: express.Response, callback: (htmlData: string) => void): void => {
		fs.readFile(path.join(path.resolve() + "/client/build/index.html"), {
			encoding: "utf-8"
		}, (err, htmlData) => {
			if (err) {
				console.error("Error during file reading", err)
				return res.status(404).end()
			}

			callback(htmlData)			
		})
	}

	static getDisplayLogo(type: "ICO" | "PNG", programName?: string): string {

		const getPath = (file: string) => `/images/programs/${file}-${type === "PNG" ? "logo" : "fav"}.${type === "PNG" ? "png" : "ico"}`

		if (programName != null && availableProgramLogos.find(current => current === programName) != null) {
			return getPath(programName)
		}
		// ? If logo doesn't exist then use the first available logo
		return getPath(availableProgramLogos[0])
	}

	populateLandingPage = (req: express.Request, res: express.Response): void => {

		MetaTagPopulator.loadIndexFile(res, (htmlData) => {
			
			htmlData = MetaTagPopulator.injectMetaTags(htmlData, {
				title: "DataLinks",
				description: "KTH Datasektionens site for links and quick access to content",
				thumbnail: MetaTagPopulator.getDisplayLogo("PNG"),
				favicon: MetaTagPopulator.getDisplayLogo("ICO")
			})

			res.send(htmlData)
		})
	}

	
	populateProgram(req: express.Request, res: express.Response): void {
		MetaTagPopulator.loadIndexFile(res, (htmlData) => {
			
			const program = req.params.program
			
			htmlData = MetaTagPopulator.injectMetaTags(htmlData, {
				title: `DataLinks - ${program}`,
				description: `${program}'s own subject board`,
				thumbnail: MetaTagPopulator.getDisplayLogo("PNG", program),
				favicon: MetaTagPopulator.getDisplayLogo("ICO", program)
			})
			
			res.send(htmlData)
		})
	}

	populateSubject = (req: express.Request, res: express.Response): void => {
		MetaTagPopulator.loadIndexFile(res, (htmlData) => {
			
			const program = req.params.program
			const course = req.params.courseCode
	
			htmlData = MetaTagPopulator.injectMetaTags(htmlData, {
				title: `DataLinks - ${program} - ${course}`,
				description: `Read more about ${course} for ${program}`,
				thumbnail: MetaTagPopulator.getDisplayLogo("PNG", program),
				favicon: MetaTagPopulator.getDisplayLogo("ICO", program)
			})
	
			res.send(htmlData)
		})
	}
}