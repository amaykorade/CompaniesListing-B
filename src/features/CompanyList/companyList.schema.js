import mongoose from "mongoose";

const companyListSchema = new mongoose.Schema({
    name: String,
    info: String,
    link: String,
    size: Number,
    domain: {
        type: [String], // Accepts an array of strings
        required: true
    },
});

export const companyListModel = mongoose.model("company-list", companyListSchema);