import { companyListModel } from "./companyList.schema.js";


export default class CompanyListRepository {

    async getAll() {
        try {
            return await companyListModel.find();
        } catch (err) {
            console.log(err);
            throw new ApplicationError("An error occurred while getting the company list")
        }
    }

    async add(data) {
        try {
            const existingJob = await companyListModel.findOne({ name: data.name })
            if (!existingJob) {
                const result = new companyListModel(data);
                await result.save();
                return result;
            } else {
                return "Company exists"
            }

        } catch (err) {
            console.log(err);
            if (err instanceof ApplicationError) {
                throw err
            }
            throw new ApplicationError("An error occurred while adding the company");
        }
    }

    async check(name) {
        try {
            const company = await companyListModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
            // console.log(company);
            return company !== null;

        } catch (err) {
            console.log(err);
            throw new ApplicationError("An error occurred while finding the company")
        }
    }

    async update(compID, comp) {
        try {
            const company = await companyListModel.findById(compID);
            if (company) {
                const query = {
                    _id: new mongoose.Types.ObjectId(compID)
                }
                const update = { $set: comp }
                const updatecompany = await companyListModel.findOneAndUpdate(query, update, { new: true });
                return company;
            } else {
                return "No such company exists";
            }


        } catch (err) {
            console.log(err);
            throw new ApplicationError("An error occurred while updating the company");
        }
    }

    async filter(minSize, maxSize, domain) {
        console.log(minSize, maxSize, domain);
        try {
            const filter = {};

            if (minSize !== undefined) {
                filter.size = { ...filter.size, $gte: minSize };
            }

            if (maxSize !== undefined) {
                filter.size = { ...filter.size, $lt: maxSize };
            }

            if (domain && domain.length > 0) {
                filter.domain = { $in: domain };
            }

            const filteredComp = await companyListModel.find(filter);
            return filteredComp;
        } catch (err) {
            console.log(err);
            throw new Error('Error filtering companies');
        }
    }

    async delete(compID) {
        try {
            const company = await companyListModel.findById(compID);
            if (company) {
                const query = {
                    _id: new mongoose.Types.ObjectId(compID)
                }
                await companyListModel.findOneAndDelete(query);
                return "Company deleted successfully";
            } else {
                return "No such company exists"
            }

        } catch (err) {
            console.log(err);
            throw new ApplicationError("An error occurred while deleting the company");
        }
    }
}