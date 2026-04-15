import { request, response } from "express"

export async function getHome(req, res) {
    res.render('index');
}