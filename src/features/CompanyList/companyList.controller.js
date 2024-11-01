import CompanyListRepository from "./companyList.repository.js";


export default class CompanyListController {
    constructor() {
        this.companyListRepository = new CompanyListRepository();
    }

    async getAll(req, res, next) {
        try {
            const result = await this.companyListRepository.getAll();
            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }

    async addComp(req, res, next) {
        try {
            // const companyImgUrl = req.file ? req.file.filename : null;
            // if (!companyImgUrl) {
            //     console.error('No file uploaded or Multer configuration issue.');
            //     return res.status(400).send('File upload failed.');
            // }
            const data = req.body;
            console.log(data);
            // data.companyImgUrl = companyImgUrl;
            const result = await this.companyListRepository.add(data);
            res.status(201).send(result);
        } catch (err) {
            next(err);
        }
    }

    async checkCompany(req, res, next) {
        try {
            const { name } = req.query;
            const lowerCaseName = name.toLowerCase();
            // console.log(lowerCaseName);
            const exists = await this.companyListRepository.check(lowerCaseName);
            res.json({ exists })
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
    }

    async filterComp(req, res) {
        try {
            const { minSize, maxSize, domain } = req.query;
            // console.log(size, domain);
            const result = await this.companyListRepository.filter(
                minSize,
                maxSize,
                domain
            );
            res.status(200).send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal server error");
        }
    }

    async update(req, res, next) {
        try {
            // const userID = req.userID;
            const compID = req.params.compId;
            // const companyImgUrl = req.file ? req.file.filename : null;
            // if (!companyImgUrl) {
            //     console.error('No file uploaded or Multer configuration issue.');
            //     return res.status(400).send('File upload failed.');
            // }
            const data = req.body;
            // prod.companyImgUrl = companyImgUrl;
            const result = await this.companyListRepository.update(compID, data);
            if (!result) {
                return res.status(404).send("Company not found");
            }
            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            // const userID = req.userID;
            const compID = req.params.compId;
            const company = await this.companyListRepository.delete(compID);
            if (!company) {
                return res.status(404).send("Company not found");
            }
            res.status(200).send(company);
        } catch (err) {
            next(err);
        }
    }
}