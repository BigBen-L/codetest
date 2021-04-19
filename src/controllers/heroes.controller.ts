import * as Express from "express";
import Hero from "../models/hero";
import heroesData from "../data/heroes.json"

const findAll = async (req: Express.Request, res: Express.Response) => {
        // Return list of all characters from data crawled from website
	const heroes :  Hero[] = heroesData
	await res.json(heroes)
}

const findById = async (req: Express.Request, res: Express.Response) => {
				// Return 1 character (based on id) from data crawled from website
	const id: string = req.params.id
	const hero: Hero[] = heroesData.filter((hero) => hero.id === id)
	await res.json(hero[0])
}

export default {
    findAll,
    findById
}